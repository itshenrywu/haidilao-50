const fs = require('fs');
const ejs = require('ejs');
let logs = JSON.parse(fs.readFileSync('./data/logs.json', 'utf8'));

logs.sort((a, b) => {
	return new Date(b.day) - new Date(a.day);
});

const initialState = {
	total: 0,
	restaurantToCount: {},
	mostVisited: { name: null, count: 0 },
	formattedLogs: [],
};

const result = logs.reduce((acc, log) => {
	const payValue = typeof log.pay === 'number' ? log.pay : 0;
	acc.total += payValue;

	const name = log.restaurant || '';
	const newCount = (acc.restaurantToCount[name] || 0) + 1;
	acc.restaurantToCount[name] = newCount;

	if (newCount > acc.mostVisited.count) {
		acc.mostVisited = { name, count: newCount };
	}

	const value = typeof log.pay === 'string' ? Number(log.pay) : log.pay;
	const payFormatted = Number.isInteger(value) 
		? `$ ${value.toLocaleString()}` 
		: '<span class="ts-text is-secondary">忘了</span>';
	acc.formattedLogs.push({ ...log, pay: payFormatted });
	
	return acc;
}, initialState);


const template = fs.readFileSync('./index.ejs', 'utf8');
const output = ejs.render(template, {
	logs: result.formattedLogs,
	total: `$ ${result.total.toLocaleString()}`,
	mostVisited: result.mostVisited
});

fs.writeFileSync('./index.html', output);
console.log('generate success!');