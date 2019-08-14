#!/usr/bin/env node

import Table from 'cli-table';
import prettyBytes from 'pretty-bytes';

import { QueuedDownload, fetchDownloadQueue } from './db';

type ColumnMapping = (row: QueuedDownload) => string;
const TABLE_COLUMNS: Record<string, ColumnMapping> = {
    Id: (row) => row.id.toString(),
    Title: (row) => row.info.title,
    Format: (row) => {
        const format = row.info.formats.find((format) => format.format_id === row.format);
        return format!.format_note;
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