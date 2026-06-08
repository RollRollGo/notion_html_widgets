document.addEventListener('DOMContentLoaded', initialize);

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const WAVES = document.querySelectorAll('.wave');
const RING = new Audio('../assets/ring.mp3');
const BEEP = new Audio('../assets/beep.mp3');
const TIMER_BUTTONS = document.querySelectorAll('.timer');

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
	const increaseButton = document.getElementById('increase');
	const decreaseButton = document.getElementById('decrease');

	const modeButtons = [pomodoroButton, shortBreakButton, longBreakButton];

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
		switchMode(
			'pomodoro',
			counterDisplay,
			startButton,
			modeButtons,
			pomodoroButton
		)
	);
	shortBreakButton.addEventListener('click', () =>
		switchMode(
			'short_break',
			counterDisplay,
			startButton,
			modeButtons,
			shortBreakButton
		)
	);
	longBreakButton.addEventListener('click', () =>
		switchMode(
			'long_break',
			counterDisplay,
			startButton,
			modeButtons,
			longBreakButton
		)
	);

	increaseButton.addEventListener('click', () => {
		timeLeft += 60;
		updateDisplay(counterDisplay);
	});

	decreaseButton.addEventListener('click', () => {
		if (timeLeft >= 60) {
			timeLeft -= 60;
			updateDisplay(counterDisplay);
		}
	});

	updateDisplay(counterDisplay);
}

//格式化时间为 MM：SS
function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${numberFormatUtil(minutes)}:${numberFormatUtil(remainingSeconds)}`;
}

function updateDisplay(counterDisplay) {
	counterDisplay.textContent = formatTime(timeLeft);
}

function startCounter(startButton, counterDisplay) {
	clearInterval(timer);
	timer = setInterval(() => decrementTime(counterDisplay, startButton), 1000);
	isRunning = true;
	startButton.textContent = 'Pause';
	toggleWaveAnimation(true);
	toggleTimerButtonDisplay(true);
}

function pauseCounter(startButton) {
	clearInterval(timer);
	isRunning = false;
	startButton.textContent = 'Start';
	toggleWaveAnimation(false);
	toggleTimerButtonDisplay(false);
}

function decrementTime(counterDisplay, startButton) {
	if (timeLeft > 0) {
		if (timeLeft <= 6) {
			BEEP.play();
		}
		timeLeft--;
		updateDisplay(counterDisplay);
	} else {
		clearInterval(timer);
		RING.play();
		isRunning = false;
		startButton.textContent = 'Start';
	}
}

function resetTimer(counterDisplay, startButton) {
	clearInterval(timer);
	setTimeByMode(currentMode);
	updateDisplay(counterDisplay);
	isRunning = false;
	startButton.textContent = 'Start';
	toggleWaveAnimation(false);
	toggleTimerButtonDisplay(false);
}

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
function switchMode(
	mode,
	counterDisplay,
	startButton,
	modeButtons,
	activeButton
) {
	currentMode = mode;
	resetTimer(counterDisplay, startButton);

	modeButtons.forEach((button) => button.classList.remove('active-mode'));

	activeButton.classList.add('active-mode');
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

//格式化时间数字为两位
function numberFormatUtil(number) {
	return String(number).padStart(2, '0');
}

//控制加减按钮的显示
function toggleTimerButtonDisplay(activate) {
	TIMER_BUTTONS.forEach((button) => {
		if (activate) {
			button.style.opacity = 0;
		} else {
			button.style.opacity = 1;
		}
	});
}
