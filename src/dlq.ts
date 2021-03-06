#!/usr/local/bin/node

import Table from 'cli-table';
import prettyBytes from 'pretty-bytes';

import { QueuedDownload, fetchDownloadQueue } from './db';

type ColumnMapping = (row: QueuedDownload) => string;
const TABLE_COLUMNS: Record<string, ColumnMapping> = {
    Id: (row) => row.id.toString(),
    Channel: (row) => row.info.uploader,
    Title: (row) => row.info.title,
    Format: (row) => {
        const format = row.info.formats.find((format) => format.format_id === row.format);
        return format!.format_note || format!.format;
    },
    Size: (row) => {
        const format = row.info.formats.find((format) => format.format_id === row.format);
        return format && format.filesize ? prettyBytes(format!.filesize) : '?';
    },
}

async function prettyPrintDownloadQueue() {
    const queue = await fetchDownloadQueue();
    const columns = Object.keys(TABLE_COLUMNS);
    const table = new Table({ head: columns });
    table.push(...queue.map((row) => columns.map((column) => TABLE_COLUMNS[column](row))));
    console.log(table.toString());
}

prettyPrintDownloadQueue();