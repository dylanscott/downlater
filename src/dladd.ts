#!/usr/bin/env node

import { fetchVideoInfo } from './ytdl';
import { appendToDownloadQueue } from './db';

async function add(url: string) {
    const info = await fetchVideoInfo(url);

    // currently only supporting format = 22
    const matchingFormat = info.formats.find((format) => format.format_id === '22');
    if (!matchingFormat) {
        throw new Error(`video ${url} does not have format 22`);
    }

    await appendToDownloadQueue(info, '22');
}

if (process.argv[2]) {
    add(process.argv[2]);
} else {
    console.log('usage: dladd [youtube URL]');
}