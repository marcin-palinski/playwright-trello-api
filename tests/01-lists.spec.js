import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
import { readJSONFile, writeJSONFile, deleteFile } from '../test-functions/functions';
import { boardName } from '../test-data/test-data';

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
    await expect(responseBody).toHaveLength(3);
});

test('POST/ create new list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;
    const newListName = 'nowa lista21002';

    // act
    const response = await request.post(`https://api.trello.com/1/lists`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
            name: newListName,
            idBoard: boardId,
        },
    });

    const checkResponse = await request.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });
    const checkResponseBody = await checkResponse.json();
    console.log(checkResponseBody);

    const newItem = {
        id: checkResponseBody[0].id,
        name: checkResponseBody[0].name,
    };

    boardData.lists.push(newItem);
    await writeJSONFile('./tmp/data.json', boardData);

    // assert
    expect(response.status()).toBe(200);
    expect(boardData.lists).toHaveLength(4);
    expect(boardData.lists).toContain(newItem);
});

test('PUT/ change name of list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;
    const listId = boardData.lists[1].id;
    const newListName = 'nowa lista2';

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

    // assert
    expect(response.status()).toBe(200);

    const checkResponse = await request.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });
    const checkResponseBody = await checkResponse.json();
    expect(checkResponseBody[1].name).toBe(newListName);
    boardData.lists[1].name = newListName;

    await writeJSONFile('./tmp/data.json', boardData);
});

test('DEL/ delete a list', async ({ request }) => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;

    // act
    const response = await request.delete(`https://api.trello.com/1/lists/${boardId}/closed`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });

    // assert
    await expect(response.status()).toBe(200);
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

// test.afterAll(async () => {
//     await deleteFile('./tmp/data.json');
// });
