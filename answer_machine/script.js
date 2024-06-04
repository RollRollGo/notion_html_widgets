document.addEventListener('DOMContentLoaded', initialize);

const QUOTE_ELEMENT = document.getElementById('quote');
const OVERLAY_TEXT = document.getElementById('overlay-text');
const TOGGLE_BUTTON = document.getElementById('toggle-button');
const LOGO_IMAGE = document.getElementById('logo');
let isQuoteDisplayed = false;

function fetchQuotes(callback) {
	fetch('answers.json')
		.then((response) => response.json())
		.then((data) => {
			const answers = extractAnswersFromJsonPair(data);
			callback(answers);
		})
		.catch((error) => console.error('Error fetching answers:', error));
}

function extractAnswersFromJsonPair(jsonPair) {
	return Object.values(jsonPair).map((item) => item.answer);
}

function getRandomIndex(quotes) {
	return Math.floor(Math.random() * quotes.length);
}

function showRandomQuotes(answers) {
	const randomIndex = getRandomIndex(answers);
	QUOTE_ELEMENT.textContent = answers[randomIndex];
	QUOTE_ELEMENT.style.display = 'inline';
	TOGGLE_BUTTON.innerHTML = 'BACK';
}

function hideOverlay() {
	OVERLAY_TEXT.style.display = 'none';
}

function showOverlay() {
	OVERLAY_TEXT.style.display = 'inline';
	QUOTE_ELEMENT.style.display = 'none';
	TOGGLE_BUTTON.innerHTML =
		'<img id="logo" src="../assets/logo.png" alt="rollrollgo" />';
}

function handleButtonClick() {
	if (isQuoteDisplayed) {
		showOverlay();
	} else {
		fetchQuotes((answers) => {
			showRandomQuotes(answers);
			hideOverlay();
		});
	}
	isQuoteDisplayed = !isQuoteDisplayed;
}

function initialize() {
	TOGGLE_BUTTON.addEventListener('click', handleButtonClick);
}
