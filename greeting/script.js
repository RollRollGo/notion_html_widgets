function updateElement(id, content) {
	document.getElementById(id).innerHTML = content;
}

function displayWidget() {
	const today = new Date();
	const hours = today.getHours();
	const minutes = today.getMinutes();

	const ampm = hours >= 12 ? 'pm' : 'am';

	const greetings = ['早上好', '下午好', '晚上好'];
	const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	const months = [
		'一月',
		'二月',
		'3月',
		'四月',
		'五月',
		'六月',
		'七月',
		'八月',
		'九月',
		'十月',
		'十一月',
		'十二月',
	];

	const greetingIndex = hours < 12 ? 0 : hours < 17 ? 1 : 2;
	const greetingStr = `${greetings[greetingIndex]} `;

	const dayName = days[today.getDay()];
	const monthName = months[today.getMonth()];
	const date = today.getDate();

	const hour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
	const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

	updateElement('greeting', greetingStr);
	updateElement('date', `${dayName}，${monthName}${date}日`);
	updateElement('time', `${hourStr} : ${minStr} ${ampm}`);

	setTimeout(displayWidget, 1000);
}

displayWidget();
