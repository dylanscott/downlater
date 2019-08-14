#!/usr/local/bin/node

import { getQueueEntry, markComplete } from './db';

async function removeFromDownloadQueue(id: number) {
    const entry = await getQueueEntry(id);
    if (entry) {
        await markComplete(id);
        console.log(`Removed "${entry.info.title}"`);
    } else {
        console.log(`${id} does not match any downloads`);
    }
}

if (process.argv[2]) {
    const id = Number(process.argv[2]);
    if (id) {
        removeFromDownloadQueue(id);
    } else {
        console.log(`${process.argv[2]} is not a valid id`);
    }
} else {
    console.log('usage: dlrm [id]');
}