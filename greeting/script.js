function updateElement(id, content) {
	document.getElementById(id).innerHTML = content;
}

function displayWidget() {
	const today = new Date();
	const hours = today.getHours();
	const minutes = today.getMinutes();

	const ampm = hours >= 12 ? 'pm' : 'am';

	const GREETINGS = ['Good Morning!', 'Good Afternoon!', 'Good Evening!'];
	const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	const MONTHS = [
		'JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC',
	];

	const greetingIndex = hours < 12 ? 0 : hours < 17 ? 1 : 2;
	const greetingStr = `${GREETINGS[greetingIndex]} `;

	const dayName = DAYS[today.getDay()];
	const monthName = MONTHS[today.getMonth()];
	const date = today.getDate();

	const hour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
	const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

	updateElement('greeting', greetingStr);
	updateElement('date', `${dayName}, ${monthName} ${date}`);
	updateElement('time', `${hourStr} : ${minStr} ${ampm}`);

	setTimeout(displayWidget, 1000);
}

displayWidget();
