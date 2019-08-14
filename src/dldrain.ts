#!/usr/local/bin/node
import moment from 'moment';

import { downloadVideo } from './ytdl';
import { fetchDownloadQueue, markComplete } from './db';

async function drain() {
    const queue = await fetchDownloadQueue();
    for (const entry of queue) {
        try {
            checkTime();
            await downloadVideo(entry.info, entry.format);
            await markComplete(entry.id);
        } catch (err) {
            console.error(`failed to download ${entry.info.display_id}`, err);
        }
    }
}

function checkTime() {
    const time = moment();
    if (time.hour() < 2 || time.hour() >= 7) {
        throw new Error("The time isn't right.");
    }
}

drain();