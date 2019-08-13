#!/usr/bin/env node

import { downloadVideo } from './ytdl';
import { fetchDownloadQueue, markComplete } from './db';

async function drain() {
    const queue = await fetchDownloadQueue();
    for (const entry of queue) {
        try {
            await downloadVideo(entry.info, entry.format);
            await markComplete(entry.id);
        } catch (err) {
            console.error(`failed to download ${entry.info.display_id}`, err);
        }
    }
}

drain();