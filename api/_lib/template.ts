
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string, background: string) {
    let background_color = '';
    let background_image = '';
    let foreground = '';

    if (theme === 'light') {
        background_color = '#ffffff';
        foreground = '#000000';
    } else {
        background_color = '#000000';
        foreground = '#ffffff';
    }

    switch (background) {
        case 'blog':
            // devブランチの画像
            background_image = 'https://raw.githubusercontent.com/Undecided-Discord/og-image/dev/public/img/blog.png';
            background_color = '';
            foreground = '#ffffff';
            break;
        default:
            background_image = '';
            break;
    }

    return `
    @import url("https://cdn.jsdelivr.net/npm/yakuhanjp@3.3.1/dist/css/yakuhanjp.min.css");
    @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
    @import url("https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap");

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono}) format("woff2");
    }

    body {
        ${
            background === '' ? `
            background-color: ${background_color};
            ` : `
            background-image: url(${background_image});
            background-position: center;
            `
        }
        background-size: 100%;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .text {
        font-family: 'YakuHanJP', 'Roboto', 'Noto Sans JP', 'Inter', sans-serif;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
        width: 80vw;
        overflow-wrap: break-word;
    }

    .blog_author {
        font-size: calc(${sanitizeHtml(fontSize)} * 0.8);
        font-style: normal;
        color: ${foreground};

        position: absolute;
        top: calc(955px - (${sanitizeHtml(fontSize)} * 0.8));
        left: 150px;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, background, blog_author } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, background)}
    </style>
    <body>
        <div class="text">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            <div class="blog_author">
                ${blog_author}
            </div>
        </div>
    </body>
</html>`;
}
