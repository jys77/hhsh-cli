#!/usr/bin/env node
const fetch = require('node-fetch');
const chalk = require('chalk');
const ora = require('ora');
const Table = require('cli-table');

const API_URL = 'https://lab.magiconch.com/api/nbnhhsh/guess';

if(process.argv.length !== 3) {
    console.log('使用方式: hhsh y1s1');
    return;
}

const input = process.argv[2];

const spinner = ora(chalk.blue('looking for: ' + input + '...')).start();

fetch(API_URL, {
    method: 'post',
    body: JSON.stringify({
        text: input,
    }),
    headers: {'Content-Type': 'application/json'},
})
    .then(res => res.json())
    .then(json => {
        spinner.stop();
        if(json instanceof Array && json.length > 0) {
            const trans = json[0].trans;
            const inputting = json[0].inputting;
            const head = trans ? ['序号', '缩写的含义'] : inputting ? ['序号', '缩写可能的含义'] : ['没有找到该缩写'];
            const table = new Table({
                head,
                chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                    , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                    , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                    , 'right': '' , 'right-mid': '' , 'middle': ' ' },
                style: { 'padding-left': 0, 'padding-right': 0 }
            })
            if (trans && trans.length > 0) {
                trans.forEach((term, index) => {
                    table.push([`${index + 1}`, term]);
                })
            } else if (inputting && inputting.length > 0) {
                inputting.forEach((term, index) => {
                    table.push([`${index + 1}`, term]);
                })
            }
            const result = table.toString();
            printResult(result);
        } else {
            console.log(chalk.green('不能好好说话了。。。'));
        }
    }).catch(err => {
        console.log(err);
})

const printResult = (result) => {
    if(result && result.length > 0) {
        console.log(chalk.green(result));
    }
}


