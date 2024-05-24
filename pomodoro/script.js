document.addEventListener('DOMContentLoaded', initialize);

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const WAVES = document.querySelectorAll('.wave');
let currentMode = 'pomodoro'; //番茄时钟的默认模式
let timer; //存储番茄时钟计时器 ID
let timeLeft = POMODORO_TIME;
let isRunning = false; //检测番茄时钟是否在计时

function initialize() {
	const counterDisplay = document.getElementById('counter');
	const startButton = document.getElementById('control_start');
	const resetButton = document.getElementById('control_reset');
	const pomodoroButton = document.getElementById('menu_pomodoro');
	const shortBreakButton = document.getElementById('menu_short_break');
	const longBreakButton = document.getElementById('menu_long_break');

	startButton.addEventListener('click', () => {
		if (isRunning) {
			pauseCounter(startButton);
		} else {
			startCounter(startButton, counterDisplay);
		}
	});
	resetButton.addEventListener('click', () =>
		resetTimer(counterDisplay, startButton)
	);
	pomodoroButton.addEventListener('click', () =>
		switchMode('pomodoro', counterDisplay, startButton)
	);
	shortBreakButton.addEventListener('click', () =>
		switchMode('short_break', counterDisplay, startButton)
	);
	longBreakButton.addEventListener('click', () =>
		switchMode('long_break', counterDisplay, startButton)
	);

	updateDisplay(counterDisplay);
}

//格式化时间为 MM：SS
function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${String(minutes).padStart(2, '0')}:${String(
		remainingSeconds
	).padStart(2, '0')}`;
}

//更新番茄时钟显示
function updateDisplay(counterDisplay) {
	counterDisplay.textContent = formatTime(timeLeft);
}

//启动番茄时钟
function startCounter(startButton, counterDisplay) {
	clearInterval(timer);
	timer = setInterval(() => decrementTime(counterDisplay, startButton), 1000);
	isRunning = true;
	startButton.textContent = 'Pause';
	toggleWaveAnimation(true);
}
//暂停番茄时钟
function pauseCounter(startButton) {
	clearInterval(timer);
	isRunning = false;
	startButton.textContent = 'Start';
	toggleWaveAnimation(false);
}
//倒计时
function decrementTime(counterDisplay, startButton) {
	if (timeLeft > 0) {
		timeLeft--;
		updateDisplay(counterDisplay);
	} else {
		clearInterval(timer);
		alert('Time is up!');
		isRunning = false;
		startButton.textContent = 'Start';
	}
}
//重置番茄时钟
function resetTimer(counterDisplay, startButton) {
	clearInterval(timer);
	setTimeByMode(currentMode);
	updateDisplay(counterDisplay);
	isRunning = false;
	startButton.textContent = 'Start';
	toggleWaveAnimation(false);
}
//根据模式设置番茄时钟时长
function setTimeByMode(mode) {
	switch (mode) {
		case 'pomodoro':
			timeLeft = POMODORO_TIME;
			break;
		case 'short_break':
			timeLeft = SHORT_BREAK_TIME;
			break;
		case 'long_break':
			timeLeft = LONG_BREAK_TIME;
			break;
	}
}
//切换番茄时钟模式并重置时间
function switchMode(mode, counterDisplay, startButton) {
	currentMode = mode;
	resetTimer(counterDisplay, startButton);
}

//控制波浪动画
function toggleWaveAnimation(activate) {
	WAVES.forEach((wave) => {
		if (activate) {
			wave.classList.add('wave-active');
		} else {
			wave.classList.remove('wave-active');
		}
	});
}
