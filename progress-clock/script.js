const DAY_NAMES = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

const MIL_SECONDS_OF_DAY = 24 * 60 * 60 * 1000;

// 进度条的颜色规则为 fadedColor 是 color 转换成 rgba 后，alpha 由 1 降为 0.2
// 由于元素嵌套，降低透明度会导致颜色叠加
// 因此将降低 alpha 后的颜色再转为 alpha 为 1 的值，再赋值给 fadedColor
// 以 year-progress 为例，color 是 #9f89b7，它的 rgba 是 rgba(161, 137, 181, 1)
// fadedColor 使用 rgba(161, 137, 181, 0.2), 将它转成 a 为 1 的值，即 RGBA(236, 231, 240, 1.00)，即 #ECE7F0
const PROGRESS_CONFIG_MAP = {
  "year-progress": {
    color: "#9f89b7",
    fadedColor: "#ECE7F0",
  },
  "month-progress": {
    color: "#84a1bd",
    fadedColor: "#E6ECF2",
  },
  "week-progress": {
    color: "#ef899f",
    fadedColor: "#FDE8EC",
  },
  "day-progress": {
    color: "#f0a395",
    fadedColor: "#FDEDEA",
  },
};

function getTimeInfo() {
  const today = new Date();
  const monthIndex = today.getMonth();
  const dayIndex = today.getDay();

  return {
    year: today.getFullYear(),
    monthIndex,
    month: monthIndex + 1,
    date: today.getDate(),
    hour: today.getHours(),
    minute: today.getMinutes(),
    second: today.getSeconds(),
    dayIndex,
    day: DAY_NAMES[dayIndex],
  };
}

function normalizeNum(num) {
  return num < 10 ? `0${num}` : num;
}

function normalizePercentage(digit) {
  // 换算成百分比后小数点后保留两位
  return Math.round(digit * 10000) / 100;
}

function updateElementContentById(id, content) {
  const ele = document.getElementById(id);
  ele.textContent = content;
}

function updateDate() {
  const { year, month, date } = getTimeInfo();
  content = `${year}.${normalizeNum(month)}.${normalizeNum(date)}`;
  updateElementContentById("date", content);
}

function updateTime() {
  const { hour, minute, second } = getTimeInfo();
  content = `${normalizeNum(hour)}:${normalizeNum(minute)}:${normalizeNum(
    second
  )}`;
  updateElementContentById("time", content);
}

function updateDay() {
  const { day } = getTimeInfo();
  updateElementContentById("day", day);
}

function getMilSecondsBetweenDates(laterDate, earlierDate) {
  return laterDate.getTime() - earlierDate.getTime();
}

function getDaysBetweenDates(laterDate, earlierDate) {
  return Math.floor(
    getMilSecondsBetweenDates(laterDate, earlierDate) / MIL_SECONDS_OF_DAY
  );
}

function getDayOfYear() {
  const { year } = getTimeInfo();
  const firstDayOfYear = new Date(year, 0);
  return getDaysBetweenDates(new Date(), firstDayOfYear);
}

function getDaysOfYear() {
  const { year } = getTimeInfo();
  return getDaysBetweenDates(new Date(year + 1, 0), new Date(year, 0));
}

function getDaysOfMonth() {
  const { year, monthIndex } = getTimeInfo();
  return getDaysBetweenDates(
    new Date(year, monthIndex + 1),
    new Date(year, monthIndex)
  );
}

function updateProgressStyle(id, percentage) {
  const ele = document.getElementById(id);
  const { color, fadedColor } = PROGRESS_CONFIG_MAP[id];
  // 颜色直接由 color 变为 fadedColor 时，分界线会有锯齿，因此在中间增加 0.2% 的 fadedColor 过渡
  ele.style.background = `conic-gradient(${color} ${percentage}%, ${fadedColor} ${
    percentage + 0.2
  }%, ${fadedColor}`;
}

function updateYearProgress() {
  const percentage = normalizePercentage(
    getDayOfYear() / getDaysOfYear()
  );
  updateProgressStyle("year-progress", percentage);
}

function updateMonthProgress() {
  const { date } = getTimeInfo();
  const percentage = normalizePercentage(date / getDaysOfMonth());
  updateProgressStyle("month-progress", percentage);
}

function updateWeekProgress() {
  const { dayIndex } = getTimeInfo();
  const finalIndex = dayIndex === 0 ? 7 : dayIndex
  const percentage = normalizePercentage(finalIndex / 7);
  updateProgressStyle("week-progress", percentage);
}

function updateDayProgress() {
  const { year, monthIndex} = getTimeInfo();

  const percentage = normalizePercentage(
    getMilSecondsBetweenDates(new Date(), new Date(year, monthIndex)) /
      MIL_SECONDS_OF_DAY
  );
  updateProgressStyle("day-progress", percentage);
}

function updateClock() {
  updateDate();
  updateTime();
  updateDay();
  updateYearProgress();
  updateMonthProgress();
  updateWeekProgress();
  updateDayProgress();
}

setInterval(updateClock, 1000);
