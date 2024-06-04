document.addEventListener('DOMContentLoaded', initialize);

const QUOTE_ELEMENT = document.getElementById('quote');
const OVERLAY_TEXT = document.getElementById('overlay-text');
const TOGGLE_BUTTON = document.getElementById('toggle-button');
let isQuoteDisplayed = false;

function fetchAnswers() {
	return fetch('answers.json')
		.then((response) => response.json())
		.then((data) => extractAnswersFromJsonPair(data))
		.catch((error) => {
			console.error('Error fetching answers:', error);
			return [];
		});
}

function extractAnswersFromJsonPair(jsonPair) {
	return Object.values(jsonPair).map((item) => item.answer);
}

function getRandomIndex(quotes) {
	return Math.floor(Math.random() * quotes.length);
}

function showRandomAnswers(answers) {
	const randomIndex = getRandomIndex(answers);
	QUOTE_ELEMENT.textContent = answers[randomIndex];
	QUOTE_ELEMENT.style.display = 'inline';
	TOGGLE_BUTTON.textContent = 'BACK';
}

function toggleOverlay() {
	if (isQuoteDisplayed) {
		OVERLAY_TEXT.style.display = 'inline';
		QUOTE_ELEMENT.style.display = 'none';
		TOGGLE_BUTTON.innerHTML =
			'<img id="logo" src="../assets/logo.png" alt="rollrollgo" />';
	} else {
		fetchAnswers().then((answers) => {
			showRandomAnswers(answers);
			OVERLAY_TEXT.style.display = 'none';
		});
	}
	isQuoteDisplayed = !isQuoteDisplayed;
}

function initialize() {
	TOGGLE_BUTTON.addEventListener('click', toggleOverlay);
}
