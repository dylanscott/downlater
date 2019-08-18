#!/usr/local/bin/node

import { VideoInfo, FormatInfo, fetchVideoInfo } from './ytdl';
import { appendToDownloadQueue } from './db';

async function add(url: string) {
    const info = await fetchVideoInfo(url);

    const matchingFormat = getAllowedDownloadFormat(info);
    if (!matchingFormat) {
        throw new Error(`video ${url} does not have compatible format`);
    }

    await appendToDownloadQueue(info, matchingFormat.format_id);
}

const ALLOWED_FORMAT_IDS = ['22', '720p'];
function getAllowedDownloadFormat(info: VideoInfo): FormatInfo | null {
    for (const id of ALLOWED_FORMAT_IDS) {
        const matchingFormat = info.formats.find((format) => format.format_id === id);
        if (matchingFormat) {
            return matchingFormat;
        }
    }
    return null;
}

if (process.argv[2]) {
    add(process.argv[2]);
} else {
    console.log('usage: dladd [youtube URL]');
}