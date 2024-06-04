document.addEventListener('DOMContentLoaded', initialize);

const QUOTE_ELEMENT = document.getElementById('quote');

function fetchQuotes() {
	fetch('answers.json')
		.then((response) => response.json())
		.then((data) => {
			const answers = extractAnswersFromJsonPair(data);
			const randomIndex = getRandomIndex(answers);
			QUOTE_ELEMENT.textContent = answers[randomIndex];
		})
		.catch((error) => console.error('Error fetching answers:', error));
}

function extractAnswersFromJsonPair(jsonPair) {
	return Object.values(jsonPair).map((item) => item.answer);
}

function getRandomIndex(quotes) {
	return Math.floor(Math.random() * quotes.length);
}

function initialize() {
	fetchQuotes();
}
