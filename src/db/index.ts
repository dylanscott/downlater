import * as path from 'path';
import { Database } from 'sqlite3';
import { promisify } from 'util';

import { VideoInfo } from '../ytdl';

const DB = new Database(path.resolve(__dirname, '../../db/db.bin'));

export interface QueuedDownload {
    id: number;
    info: VideoInfo;
    format: string;
}

export interface YTDLQueueRow {
    id: number;
    json: string;
    format: string;
}

export async function fetchDownloadQueue(): Promise<QueuedDownload[]> {
    const rows = await promisify((cb: (err: Error | null, rows: YTDLQueueRow[]) => void) => {
        return DB.all('SELECT * FROM YTDLQueue;', cb);
    })();
    return rows.map((row) => ({
        id: row.id,
        format: row.format,
        info: JSON.parse(row.json),
    }));
}

export async function getQueueEntry(id: number): Promise<QueuedDownload | null> {
    const row = await promisify((cb: (err: Error | null, row: YTDLQueueRow) => void) => {
        return DB.get('SELECT * FROM YTDLQueue WHERE id = ?;', id, cb);
    })();
    return {
        id: row.id,
        format: row.format,
        info: JSON.parse(row.json),
    };
}

export async function markComplete(id: number): Promise<void> {
    await promisify((cb: (err: Error | null) => void) => {
        return DB.run('DELETE FROM YTDLQueue WHERE id = ?', id, cb);
    })();
}

export async function appendToDownloadQueue(info: VideoInfo, format: string): Promise<void> {
    await promisify((cb: (err: Error | null) => void) => {
        return DB.run('INSERT INTO YTDLQueue(json, format) VALUES (?, ?)', JSON.stringify(info), format, cb);
    })();
}