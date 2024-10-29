// @ts-nocheck

import puppeteer from 'puppeteer'; // or import puppeteer from 'puppeteer-core';
import { startDb22 } from './lib/db/db22?v1';
import * as fs from 'fs';

const pause = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('done');
        }, 10000);
    });
};

function runnable(fn) {
    return new Function('arguments', `return ${fn.toString()}(arguments)`);
}

describe('test', () => {
    test('test test', async () => {
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:5173');

        await pause();
        //await page.evaluate(fs.readFileSync('./lib/db/db22.js', 'utf8'));
        const db = await page.evaluate(runnable(startDb22));
    }, 120000);
});
