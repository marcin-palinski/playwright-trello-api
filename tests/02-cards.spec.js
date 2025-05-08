import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
import { readJSONFile, writeJSONFile, deleteFile } from '../test-functions/functions';

test.skip('POST/ add card to list', { tag: '@WIP' }, async () => {
    // arrange
    const boardData = await readJSONFile('./tmp/data.json');
    const boardId = boardData.boardId;

    // act
    const response = await request.post(`https://api.trello.com/1/cards`, {
        params: {
            key: process.env.KEY,
            token: process.env.TOKEN,
        },
    });

    // assert
});
