function getCurrentTime() {
	const date = new Date();
	// 把返回值改成键为 hour/minute/second 的对象，与后面的 elements 格式一致，这样就可以简化后面 initTime 和 flipClock 的写法
	return {
		hour: String(date.getHours()).padStart(2, '0'),
		minute: String(date.getMinutes()).padStart(2, '0'),
		second: String(date.getSeconds()).padStart(2, '0'),
	};
}

function getNextDigit(current, unit) {
	let next = Number(current) + 1;
	if (unit.className.includes('hour')) {
		next = next >= 24 ? '00' : String(next).padStart(2, '0');
	} else {
		next = next >= 60 ? '00' : String(next).padStart(2, '0');
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
function updateElement(value, element) {
	const next = getNextDigit(value, element.digit);
	element.digit.dataset.digitBefore = value;
	element.digit.dataset.digitAfter = next;
	element.cardFaceFront.textContent = value;
	element.cardFaceBack.textContent = next;
}

function initCurrentTime() {
	const timeUnits = getCurrentTime();

	for (const key in timeUnits) {
		updateElement(timeUnits[key], elements[key]);
	}
}

function flipCard(el, value) {
	el.card.classList.add('flipped');
	el.card.addEventListener(
		'transitionend',
		function () {
			//卡片翻转之后需要更新卡片内部的信息
			updateElement(value, el);
			// 创建克隆卡片，是为了确保克隆卡片不会立刻翻转
			//true 是深拷贝，包含 node 内的文本
			const cardClone = el.card.cloneNode(true);
			cardClone.classList.remove('flipped');
			el.digit.replaceChild(cardClone, el.card);
			//在 elements 对象中用克隆的卡片替换原始卡片，以保证正确的引用
			el.card = cardClone;
			el.cardFaces = el.card.querySelectorAll('.card-face');
			el.cardFaceFront = el.cardFaces[0];
			el.cardFaceBack = el.cardFaces[1];
		},
		{ once: true }
	);
}

function flipClock() {
	const timeUnits = getCurrentTime();

	for (const key in timeUnits) {
		if (timeUnits[key] !== elements[key].digit.dataset.digitBefore) {
			flipCard(elements[key], timeUnits[key]);
		}
	}
}

function launchClock() {
	initCurrentTime();
	setInterval(flipClock, 1000);
}

launchClock();
