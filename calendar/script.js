function getSolarDateInfo(today) {
	return {
		month: today.toLocaleDateString('zh-CN', { month: 'long' }),
		day: today.getDate(),
		weekday: today.toLocaleDateString('zh-CN', { weekday: 'long' }),
	};
}

function getLunarDateInfo(lunar) {
	return {
		month: `农历${lunar.getMonthInChinese()}月`,
		day: lunar.getDayInChinese(),
		weekday: `星期${lunar.getWeekInChinese()}`,
	};
}

function displayDateInfo(dateInfo) {
	Object.keys(dateInfo).forEach((key) => {
		document.getElementById(key).textContent = dateInfo[key];
	});
}

function initializeEventListeners(solarDate, lunarDate) {
	const CONTAINER = document.getElementById('container');

	CONTAINER.addEventListener('mousedown', () => {
		displayDateInfo(lunarDate);
	});

	CONTAINER.addEventListener('mouseup', () => {
		displayDateInfo(solarDate);
	});
}

function initialize() {
	const TODAY = new Date();
	const LUNAR = Lunar.fromDate(TODAY);

	const SOLAR_DATE = getSolarDateInfo(TODAY);
	const LUNAR_DATE = getLunarDateInfo(LUNAR);

	displayDateInfo(SOLAR_DATE);

	document.getElementById('yi-list').textContent = `${LUNAR.getDayYi()}`;
	document.getElementById('ji-list').textContent = LUNAR.getDayJi();

	initializeEventListeners(SOLAR_DATE, LUNAR_DATE);
}

document.addEventListener('DOMContentLoaded', initialize);
