function getSolarDateInfo(date) {
	return {
		month: date.toLocaleDateString('zh-CN', { month: 'long' }),
		day: date.getDate(),
		weekday: date.toLocaleDateString('zh-CN', { weekday: 'long' }),
	};
}

function getLunarDateInfo(lunar) {
	return {
		month: `农历${lunar.getMonthInChinese()}月`,
		day: lunar.getDayInChinese(),
	};
}

function displayCardInfo(info) {
	const DATE_PAGE = document.getElementById('date');
	DATE_PAGE.innerHTML = '';

	Object.keys(info).forEach((key) => {
		const childElement = document.createElement('p');
		childElement.id = key;
		childElement.textContent = info[key];
		DATE_PAGE.appendChild(childElement);
	});

	if (info.month.includes('农历')) {
		const childElement = document.createElement('img');
		childElement.id = 'logo';
		childElement.src = '../assets/logo.png';
		DATE_PAGE.appendChild(childElement);
	}
}

function initializeEventListeners(solarDate, lunarDate) {
	const CONTAINER = document.getElementById('container');

	CONTAINER.addEventListener('mousedown', () => {
		displayCardInfo(lunarDate);
	});

	CONTAINER.addEventListener('mouseup', () => {
		displayCardInfo(solarDate);
	});
}

function initialize() {
	const TODAY = new Date();
	const LUNAR = Lunar.fromDate(TODAY);

	const SOLAR_DATE = getSolarDateInfo(TODAY);
	const LUNAR_DATE = getLunarDateInfo(LUNAR);

	displayCardInfo(SOLAR_DATE);

	document.getElementById('yi-list').textContent = LUNAR.getDayYi().join(' ');
	document.getElementById('ji-list').textContent = LUNAR.getDayJi().join(' ');

	initializeEventListeners(SOLAR_DATE, LUNAR_DATE);
}

document.addEventListener('DOMContentLoaded', initialize);
