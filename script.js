const ts = () => (new Date()).getTime();
const round = (value, decimals) => Number(Math.round(value+'e'+decimals)+'e-'+decimals);

const startTime = ts();
let currentTime = startTime;
const progress = [];
const events = [];
const length = 3;

const contentElement = document.getElementById('content');
const resultElement = document.getElementById('result');

const renderProgress = () => {
	let content = '<div>';

	progress.forEach(key => {
		if (key.nl) {
			content += `</div><div>`;
		} else {
			content += `<span class="right">${key.actual}</span>`;
		}
	});

	content += `<span class='active'>&nbsp;</span></div>`;

	contentElement.innerHTML = content;
};

const renderResult = (endTime) => {
	const total = progress.length;
	const words = total / 5;
	const seconds = (endTime - startTime - progress[0].delay) / 1000;
	const minutes = seconds / 60;
	const gross = words / minutes;

	resultElement.innerHTML = `
		<div>Congratulations! You finished in ${round(seconds, 3)} seconds.</div>
		<div>You typed ${total} characters.</div>
		<div>Your gross wpm was ${round(gross, 3)}.</div>
	`;
};

renderProgress();

let finishing = false;
let finished = false;

document.onkeydown = event => {
	if (finished) return;

	const newTime = ts();
	const delay = newTime - currentTime;
	currentTime = newTime;

	if (event.key.length === 1) {
		finishing = false;
		const actual = event.key;

		progress.push({actual, delay});
		renderProgress();
		event.preventDefault();
	}

	if (event.code === 'Backspace') {
		finishing = false;
		progress.splice(-1, 1);
		renderProgress();
		event.preventDefault();
	}

	if (event.code === 'Enter') {
		if (finishing) {
			renderResult(newTime);
			finished = true;
		} else {
			progress.push({nl: true, delay});
			renderProgress();
			finishing = true;
		}
		event.preventDefault();
	}
};