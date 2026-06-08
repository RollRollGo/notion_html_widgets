const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const yearElement = document.getElementById("calendar-year");
const monthElement = document.getElementById("calendar-month");
const daysElement = document.getElementById("calendar-days");
const previousButton = document.getElementById("previous-month");
const nextButton = document.getElementById("next-month");

const today = new Date();
let visibleDate = new Date(today.getFullYear(), today.getMonth(), 1);

function isSameDay(firstDate, secondDate) {
	return (
		firstDate.getFullYear() === secondDate.getFullYear() &&
		firstDate.getMonth() === secondDate.getMonth() &&
		firstDate.getDate() === secondDate.getDate()
	);
}

function formatDateTime(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function createEmptyCell() {
	const dayCell = document.createElement("span");
	dayCell.className = "day is-empty";
	dayCell.setAttribute("aria-hidden", "true");

	return dayCell;
}

function createDayCell(date) {
	const dayCell = document.createElement("time");
	dayCell.className = "day";
	dayCell.dateTime = formatDateTime(date);
	dayCell.textContent = date.getDate();

	if (isSameDay(date, today)) {
		dayCell.classList.add("is-today");
		dayCell.setAttribute("aria-label", `Today, ${date.toLocaleDateString("en-US")}`);
	}

	return dayCell;
}

function renderCalendar() {
	const year = visibleDate.getFullYear();
	const month = visibleDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const firstWeekday = firstDay.getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const totalCells = firstWeekday + daysInMonth > 35 ? 42 : 35;

	yearElement.textContent = year;
	monthElement.textContent = monthNames[month];
	daysElement.innerHTML = "";

	for (let index = 0; index < totalCells; index += 1) {
		const dayNumber = index - firstWeekday + 1;

		if (dayNumber < 1 || dayNumber > daysInMonth) {
			daysElement.appendChild(createEmptyCell());
			continue;
		}

		daysElement.appendChild(createDayCell(new Date(year, month, dayNumber)));
	}
}

previousButton.addEventListener("click", () => {
	visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1);
	renderCalendar();
});

nextButton.addEventListener("click", () => {
	visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1);
	renderCalendar();
});

renderCalendar();
