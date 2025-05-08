import { readFile, writeFile, unlink } from 'fs/promises';

export async function readJSONFile(path) {
    const jsonFile = await readFile(path, 'utf-8');
    const file = JSON.parse(jsonFile);
    return file;
}

export async function writeJSONFile(path, data) {
    const jsonFile = JSON.stringify(data);
    await writeFile(path, jsonFile);
}

export async function deleteFile(path) {
    await unlink(path);
}
