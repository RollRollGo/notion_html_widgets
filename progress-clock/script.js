const DAY_NAMES = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

function getTimeInfo() {
  const today = new Date();

  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    hour: today.getHours(),
    minute: today.getMinutes(),
    second: today.getSeconds(),
    day: DAY_NAMES[today.getDay()],
  };
}

function normalizeNum(num) {
  return num < 10 ? `0${num}` : num;
}

function updateElementById(id, content) {
  const ele = document.getElementById(id)
  ele.innerHTML = content
}

function updateDate() {
  const { year, month, date } = getTimeInfo();
  content = `${year}.${normalizeNum(month)}.${normalizeNum(date)}`;
  updateElementById("date", content)
}

function updateTime() {
  const { hour, minute, second } = getTimeInfo();
  content = `${normalizeNum(hour)}:${normalizeNum(
    minute
  )}:${normalizeNum(second)}`;
  updateElementById("time", content)
}

function updateDay() {
  const { day } = getTimeInfo();
  updateElementById("day", day)
}

function updateClock() {
  updateDate();
  updateTime();
  updateDay();
}

setInterval(updateClock, 1000)
