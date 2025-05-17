const fs = require('fs');
const ejs = require('ejs');
let logs = JSON.parse(fs.readFileSync('./data/logs.json', 'utf8'));

logs.sort((a, b) => {
    return new Date(b.day) - new Date(a.day);
});

const template = fs.readFileSync('./index.ejs', 'utf8');

const output = ejs.render(template, { logs });
fs.writeFileSync('./index.html', output);
console.log('generate success!');