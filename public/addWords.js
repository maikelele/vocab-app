/**
 * Inicjalizuje aplikację po pełnym załadowaniu zawartości DOM.
 * Wykonuje konfigurację początkową i dodaje nasłuchiwacze zdarzeń do elementów interfejsu.
 */
document.addEventListener('DOMContentLoaded', async () => {
    /**
     * Adres email użytkownika pobrany z ciasteczek.
     * @type {string|null}
     */
    const email = getCookie('email');

    /**
     * Formularz dodawania nowego słowa.
     * @type {HTMLFormElement}
     */
    const addWordForm = document.getElementById('addWordForm');

    /**
     * Element selektora języka.
     * @type {HTMLSelectElement}
     */
    const languageSelect = document.getElementById('languageSelect');

    /**
     * Aktualnie wybrany język.
     * @type {string}
     */
    let language = languageSelect.value;

    /**
     * Obsługuje zmianę wybranego języka w selektorze.
     * Aktualizuje wartość zmiennej `language` i wypisuje ją w konsoli.
     */
    languageSelect.addEventListener('change', () => {
        language = languageSelect.value;
        console.log("Wybrany język:", language);
    });

    /**
     * Obsługuje wysłanie formularza do dodawania nowego słowa.
     * Waliduje wprowadzone dane, a następnie wysyła żądanie POST do serwera,
     * aby dodać słowo do bazy danych.
     *
     * @param {Event} e - Obiekt zdarzenia wysłania formularza.
     */
    addWordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        /**
         * Słowo wpisane przez użytkownika.
         * @type {string}
         */
        const word = document.getElementById('word').value.trim();

        /**
         * Tłumaczenie wpisane przez użytkownika.
         * @type {string}
         */
        const translation = document.getElementById('translation').value.trim();

        if (!word || !translation) {
            alert('Proszę wypełnić oba pola');
            return;
        }

        console.log("Dodawanie słowa:", {
            słowo: word,
            tłumaczenie: translation,
            email,
            język: language
        });

        try {
            const response = await fetch('/add-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word: word,
                    translation: translation,
                    email: email,
                    language: language,
                }),
            });

            if (!response.ok) {
                throw new Error('Błąd podczas dodawania słowa');
            }

            const data = await response.json();
            console.log(data);
            alert(data.insert_word);


            addWordForm.reset();
        } catch (error) {
            console.error('Wystąpił błąd:', error);
            alert('Nie udało się dodać słowa. Spróbuj ponownie później.');
        }
    });
    document.getElementById('importCsvButton').addEventListener('click', () => {
        const fileInput = document.getElementById('csvFileInput');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                const words = parseCsv(csvData);
                uploadWords(words);
            };
            reader.readAsText(file);
        } else {
            alert('Please select a CSV file to upload.');
        }
    });
});

/**
 * Pobiera wartość ciasteczka o podanej nazwie.
 *
 * @param {string} name - Nazwa ciasteczka.
 * @returns {string|null} Wartość ciasteczka lub null, jeśli nie znaleziono.
 */
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

/**
 * Parses CSV data into an array of word objects.
 *
 * @param {string} csvData - The CSV data as a string.
 * @returns {Array<Object>} An array of word objects.
 */
function parseCsv(csvData) {
    const lines = csvData.split('\n');
    const words = [];

    for (const line of lines) {
        const [word, translation, proficiency, lastReviewed] = line.split(',');

        if (word && translation) {
            words.push({
                word: word.trim(),
                translation: translation.trim(),
                proficiency: proficiency ? proficiency.trim() : '',
                last_reviewed: lastReviewed ? lastReviewed.trim() : ''
            });
        }
    }

    return words;
}

/**
 * Uploads the parsed words to the server.
 *
 * @param {Array<Object>} words - An array of word objects.
 */
async function uploadWords(words) {
    const email = getCookie('email');
    const language = document.getElementById('languageSelect').value;

    console.log(words.length)
    let word;
    let translation;
    for (let i = 0; i < words.length; i++) {
        console.log(words[i].word);
        word = words[i].word;
        translation = words[i].translation;
        try {
            const response = await fetch('/add-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word: word,
                    translation: translation,
                    email: email,
                    language: language,
                }),
            });

            if (!response.ok) {
                throw new Error('Błąd podczas dodawania słowa');
            }

            const data = await response.json();
            console.log(data);

            addWordForm.reset();
        } catch (error) {
            console.error('Wystąpił błąd:', error);
            alert('Nie udało się dodać słowa. Spróbuj ponownie później.');
        }
    }
}
