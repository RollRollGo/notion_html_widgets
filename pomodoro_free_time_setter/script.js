document.addEventListener('DOMContentLoaded', initialize);

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const RING = new Audio('../assets/ring.mp3');
const BEEP = new Audio('../assets/beep.mp3');
const TIMER_BUTTONS = document.querySelectorAll('.timer');
const WAVE_CANVAS = document.getElementById('wave_canvas');
const WAVE_CONTEXT = WAVE_CANVAS.getContext('2d');
const THEMES = {
	pomodoro: {
		primaryColor: '#a91d3a',
		backgroundColor: '#f5dad2',
		waves: ['#FFB1B1', '#FF8E8F'],
	},
	short_break: {
		primaryColor: '#2364aa',
		backgroundColor: '#dcecff',
		waves: ['#A9D6FF', '#72B8F5'],
	},
	long_break: {
		primaryColor: '#2f6f4e',
		backgroundColor: '#dff3e5',
		waves: ['#A8E6B2', '#73D389'],
	},
};

let currentMode = 'pomodoro'; //番茄时钟的默认模式
let timer; //存储番茄时钟计时器 ID
let timeLeft = POMODORO_TIME;
let isRunning = false; //检测番茄时钟是否在计时
let waveTime = 0;
let waveAmplitude = 0;
let currentWaveColors = THEMES.pomodoro.waves;

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
		resetTimer(counterDisplay, startButton),
	);
	pomodoroButton.addEventListener('click', () =>
		switchMode(
			'pomodoro',
			counterDisplay,
			startButton,
			modeButtons,
			pomodoroButton,
		),
	);
	shortBreakButton.addEventListener('click', () =>
		switchMode(
			'short_break',
			counterDisplay,
			startButton,
			modeButtons,
			shortBreakButton,
		),
	);
	longBreakButton.addEventListener('click', () =>
		switchMode(
			'long_break',
			counterDisplay,
			startButton,
			modeButtons,
			longBreakButton,
		),
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
	resizeWaveCanvas();
	drawWave();
	window.addEventListener('resize', resizeWaveCanvas);
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
		toggleWaveAnimation(false);
		toggleTimerButtonDisplay(false);
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
	activeButton,
) {
	currentMode = mode;
	resetTimer(counterDisplay, startButton);
	applyTheme(mode);

	modeButtons.forEach((button) => button.classList.remove('active-mode'));

	activeButton.classList.add('active-mode');
}

function applyTheme(mode) {
	const theme = THEMES[mode];
	const root = document.documentElement;

	root.style.setProperty('--primary-color', theme.primaryColor);
	root.style.setProperty('--background-color', theme.backgroundColor);
	currentWaveColors = theme.waves;
}

//控制波浪动画
function toggleWaveAnimation(activate) {
	isRunning = activate;
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

function resizeWaveCanvas() {
	const pixelRatio = window.devicePixelRatio || 1;
	const width = WAVE_CANVAS.offsetWidth;
	const height = WAVE_CANVAS.offsetHeight;

	WAVE_CANVAS.width = width * pixelRatio;
	WAVE_CANVAS.height = height * pixelRatio;
	WAVE_CONTEXT.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawWave() {
	const width = WAVE_CANVAS.offsetWidth;
	const height = WAVE_CANVAS.offsetHeight;
	const targetAmplitude = isRunning ? 18 : 0;

	waveAmplitude += (targetAmplitude - waveAmplitude) * 0.08;
	waveTime += isRunning ? 0.026 : 0.006;

	WAVE_CONTEXT.clearRect(0, 0, width, height);
	drawSingleWave(currentWaveColors[0], height * 0.25, waveAmplitude, waveTime, 0);
	drawSingleWave(
		currentWaveColors[1],
		height * 0.25,
		waveAmplitude * 0.75,
		waveTime,
		1.5,
	);

	requestAnimationFrame(drawWave);
}

function drawSingleWave(color, baseY, amplitude, time, offset) {
	const width = WAVE_CANVAS.offsetWidth;
	const height = WAVE_CANVAS.offsetHeight;
	const breathing = 0.94 + Math.sin(time * 0.8 + offset) * 0.06;

	WAVE_CONTEXT.beginPath();
	WAVE_CONTEXT.moveTo(0, baseY);

	for (let x = 0; x <= width; x += 2) {
		const primaryWave = Math.sin(x * 0.024 + time * 1.35 + offset);
		const softFlow = Math.sin(x * 0.012 + time * 0.32 + offset) * 0.1;
		const y = baseY + (primaryWave + softFlow) * amplitude * breathing;

		WAVE_CONTEXT.lineTo(x, y);
	}

	WAVE_CONTEXT.lineTo(width, height);
	WAVE_CONTEXT.lineTo(0, height);
	WAVE_CONTEXT.closePath();
	WAVE_CONTEXT.fillStyle = color;
	WAVE_CONTEXT.fill();
}
