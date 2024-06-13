function getCurrentTime() {
	const date = new Date();
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');
	const second = String(date.getSeconds()).padStart(2, '0');
	return { hour, minute, second };
}

function getNextDigit(current, unit) {
	let next = +current + 1;
	if (unit.className.includes('hour')) {
		next >= 24 ? (next = '00') : (next = String(next).padStart(2, '0'));
	} else {
		next >= 60 ? (next = '00') : (next = String(next).padStart(2, '0'));
	}
	return next;
}

const elements = {
	hour: { digit: document.getElementById('hour') },
	minute: { digit: document.getElementById('minute') },
	second: { digit: document.getElementById('second') },
};

for (const key in elements) {
	const el = elements[key];
	el.card = el.digit.querySelector('.card');
	el.cardFaces = el.card.querySelectorAll('.card-face');
	el.cardFaceFront = el.cardFaces[0];
	el.cardFaceBack = el.cardFaces[1];
}
//更新时钟对应的卡片显示
function updateElement(value, targetNode, targetFaceFront, targetFaceBack) {
	const next = getNextDigit(value, targetNode);
	targetNode.dataset.digitBefore = value;
	targetNode.dataset.digitAfter = next;
	targetFaceFront.textContent = value;
	targetFaceBack.textContent = next;
}

function initCurrentTime() {
	const { hour, minute, second } = getCurrentTime();
	updateElement(
		hour,
		elements.hour.digit,
		elements.hour.cardFaceFront,
		elements.hour.cardFaceBack
	);
	updateElement(
		minute,
		elements.minute.digit,
		elements.minute.cardFaceFront,
		elements.minute.cardFaceBack
	);
	updateElement(
		second,
		elements.second.digit,
		elements.second.cardFaceFront,
		elements.second.cardFaceBack
	);
}

function flipCard(el, value) {
	el.card.classList.add('flipped');
	el.card.addEventListener(
		'transitionend',
		function () {
			updateElement(value, el.digit, el.cardFaceFront, el.cardFaceBack);
			// 创建克隆卡片，是为了确保克隆卡片不会立刻翻转
			const cardClone = el.card.cloneNode(true);
			cardClone.classList.remove('flipped');
			el.digit.replaceChild(cardClone, el.card);
			//用克隆的卡片替换原始卡片
			el.card = cardClone;
			el.cardFaces = el.card.querySelectorAll('.card-face');
			el.cardFaceFront = el.cardFaces[0];
			el.cardFaceBack = el.cardFaces[1];
		},
		{ once: true }
	);
}

function flipClock() {
	const { hour, minute, second } = getCurrentTime();

	if (second !== elements.second.digit.dataset.digitBefore) {
		flipCard(elements.second, second);
	}

	if (minute !== elements.minute.digit.dataset.digitBefore) {
		flipCard(elements.minute, minute);
	}

	if (hour !== elements.hour.digit.dataset.digitBefore) {
		flipCard(elements.hour, hour);
	}
}

function launchClock() {
	initCurrentTime();
	setInterval(flipClock, 1000);
}

launchClock();
