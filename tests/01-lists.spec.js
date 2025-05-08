import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
import { readJSONFile, writeJSONFile, deleteFile } from '../test-functions/functions';
import { boardName, listName } from '../test-data/test-data';

test('POST/ create a board', async ({ request }) => {
    // act
    const response = await request.post('https://api.trello.com/1/boards/', {
        params: {
            name: boardName,
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });

    const responseBody = await response.json();
    const boardId = responseBody.id;

    await writeJSONFile('./tmp/data.json', { boardId: boardId, boardName: boardName });

    // assert
    expect(response.status()).toBe(200);
    expect(responseBody.name).toBe(boardName);
});

test('GET/ get lists of new board', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;

    // act
    const response = await request.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });

    const responseBody = await response.json();

    // tablica obiektów id i name
    const list = responseBody.map((item) => ({
        id: item.id,
        name: item.name,
    }));

    boardData.lists = list;
    await writeJSONFile('./tmp/data.json', boardData);

    // assert
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveLength(3);
});

test('POST/ create new list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;

    // act
    const response = await request.post(`https://api.trello.com/1/lists`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
            name: listName,
            idBoard: boardId,
        },
    });

    const responseBody = await response.json();

    const newItem = {
        id: responseBody.id,
        name: responseBody.name,
    };

    boardData.lists.push(newItem);
    await writeJSONFile('./tmp/data.json', boardData);

    // assert
    expect(response.status()).toBe(200);
    expect(responseBody).toMatchObject(newItem);
    expect(boardData.lists).toContain(newItem);
});

test('GET/ verify lists after creating new list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;
    const listLength = boardData.lists.length;

    // act
    const response = await request.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });

    const responseBody = await response.json();

    // assert
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveLength(listLength);
    expect(responseBody[0]).toMatchObject(boardData.lists[listLength - 1]);
});

test('PUT/ change name of list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const listId = boardData.lists[boardData.lists.length - 1].id;
    const newListName = `nowa lista ${new Date().getMilliseconds()}`;

    // act
    const response = await request.put(`https://api.trello.com/1/lists/${listId}`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
        data: {
            name: newListName,
        },
    });

    const responseBody = await response.json();
    console.log(responseBody);

    boardData.lists[boardData.lists.length - 1].name = newListName;
    await writeJSONFile('./tmp/data.json', boardData);

    // assert
    expect(response.status()).toBe(200);
    expect(responseBody.name).toBe(newListName);
    expect(boardData.lists[boardData.lists.length - 1].name).toBe(newListName);
});

test('GET/ verify list after changing name', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;

    // act
    const response = await request.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });

    const responseBody = await response.json();

    // assert
    expect(response.status()).toBe(200);
    expect(responseBody[0].name).toBe(boardData.lists[boardData.lists.length - 1].name);
});

test('PUT/ close a list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const listId = boardData.lists[boardData.lists.length - 1].id;

    // act
    const response = await request.put(`https://api.trello.com/1/lists/${listId}/closed`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
            value: true,
        },
    });

    const newArr = boardData.lists.filter((item) => item.id === listId);
    newArr[0].closed = true;

    await writeJSONFile('./tmp/data.json', boardData);

    // assert
    expect(response.status()).toBe(200);
});

test('PUT/ open a closed list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const listId = boardData.lists[boardData.lists.length - 1].id;

    // act
    const response = await request.put(`https://api.trello.com/1/lists/${listId}/closed`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
            value: false,
        },
    });

    const newArr = boardData.lists.filter((item) => item.id === listId);
    newArr[0].closed = false;

    await writeJSONFile('./tmp/data.json', boardData);

    // assert
    expect(response.status()).toBe(200);
});
test('DEL/ delete a board', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;

    // act
    const response = await request.delete(`https://api.trello.com/1/boards/${boardId}`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });

    // assert
    await expect(response.status()).toBe(200);
});

test.afterAll(async () => {
    await deleteFile('./tmp/data.json');
});
