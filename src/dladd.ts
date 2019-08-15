#!/usr/local/bin/node

import { magenta } from 'kleur';
import _ from 'lodash';
import prettyBytes from 'pretty-bytes';
import prompts from 'prompts';

import { FormatInfo, fetchVideoInfo } from './ytdl';
import { appendToDownloadQueue } from './db';

const ALLOWED_FORMATS = ['360p', '480p', '720p', '1080p'];

async function add(url: string) {
    const info = await fetchVideoInfo(url);
    console.log(`${magenta(info.uploader)} — ${info.title}`);


    const validFormatsBySize = _.groupBy(
        info.formats.filter((format) => ALLOWED_FORMATS.includes(format.format_note)),
        'format_note',
    );
    if (_.isEmpty(validFormatsBySize)) {
        throw new Error('no valid formats found');
    }

    const smallestFormatsBySize = _.mapValues(validFormatsBySize, (formats) => _.minBy(formats, 'filesize'));
    const availableFormats: FormatInfo[] = ALLOWED_FORMATS
        .map((format) => smallestFormatsBySize[format]!)
        .filter((format) => format != null);
    const { value: formatId } = await prompts({
        type: 'select',
        name: 'value',
        message: 'Pick a format',
        choices: availableFormats.map((format) => ({
            title: format.format_note,
            description: format.filesize ? prettyBytes(format.filesize) : '(unknown size)',
            value: format.format_id,
        })),
        initial: availableFormats.findIndex((format) => format.format_note === '720p'),
    });

    if (formatId) {
        await appendToDownloadQueue(info, formatId);
    }
}

if (process.argv[2]) {
    add(process.argv[2]);
} else {
    console.log('usage: dladd [youtube URL]');
}