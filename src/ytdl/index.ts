import { exec as execRaw } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execRaw);

export interface VideoInfo {
    display_id: string;
    title: string;
    description: string;
    upload_date: string;
    uploader: string;
    webpage_url: string;
    formats: FormatInfo[];
    tags: string[];
}

export interface FormatInfo {
    format_id: string;
    format_note: string;
    format: string;
    height: number;
    width: number;
    filesize: number;
}

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
    const { stdout } = await exec(`/usr/local/bin/youtube-dl --dump-single-json ${url}`);
    return JSON.parse(stdout);
}

export async function downloadVideo(info: VideoInfo, format: string): Promise<void> {
    await exec(`/usr/local/bin/youtube-dl --no-progress --format ${format} -o '/Users/dylanscott/Downloads/%(title)s.%(ext)s' ${info.webpage_url}`);
}