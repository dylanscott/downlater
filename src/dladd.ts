#!/usr/local/bin/node

import { fetchVideoInfo } from './ytdl';
import { appendToDownloadQueue } from './db';

const ALLOWED_FORMAT_ID = '22';

async function add(url: string) {
    const info = await fetchVideoInfo(url);

    // currently only supporting format = 22
    const matchingFormat = info.formats.find((format) => format.format_id === ALLOWED_FORMAT_ID);
    if (!matchingFormat) {
        throw new Error(`video ${url} does not have format ${ALLOWED_FORMAT_ID}`);
    }

    await appendToDownloadQueue(info, ALLOWED_FORMAT_ID);
}

if (process.argv[2]) {
    add(process.argv[2]);
} else {
    console.log('usage: dladd [youtube URL]');
}