
/**
 * Funkcja inicjalizująca działanie po pełnym załadowaniu DOM.
 * Obsługuje pobieranie i wyświetlanie listy słówek użytkownika oraz ich właściwości.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Element selektora języka.
     * @type {HTMLSelectElement}
     */
    const languageSelect = document.getElementById('languageSelect');

    /**
     * Lista słówek użytkownika.
     * @type {HTMLElement}
     */
    const wordsList = document.getElementById('words-list');


    /**
     * Lista poziomów opanowania słówek.
     * @type {HTMLElement}
     */
    const proficiencyList = document.getElementById('proficiency-list');

    /**
     * Lista dat ostatniego zapamiętania słówek.
     * @type {HTMLElement}
     */
    const lastMemorizedList = document.getElementById('last-memorized-list');

    /**
     * Email użytkownika pobrany z ciasteczek.
     * @type {string|null}
     */
    const email = getCookie('email');
    console.log("Email: " + email);

    /**
     * Pobiera listę słówek użytkownika z serwera.
     *
     * @param {string} email - Email użytkownika.
     * @param {string} language - Wybrany język.
     */
    const fetchWords = async (email, language) => {
        try {
            const response = await fetch('vocabulary-list', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, language}),
            });
            const data = await response.json();
            populateWords(data);
        } catch (error) {
            console.error('Błąd podczas pobierania słówek:', error);
            wordsList.innerHTML = '<p>Brak słówek</p>';
        }
    };

    /**
     * Wypełnia listy danymi o słówkach.
     *
     * @param {Array<Object>} words - Lista słówek, każda z właściwościami `word`, `translation`, `proficiency`, `last_reviewed`.
     */
    const populateWords = (words) => {
        wordsList.innerHTML = '';
        proficiencyList.innerHTML = '';
        lastMemorizedList.innerHTML = '';
        console.log(words);

        if (words.length === 0) {
            wordsList.innerHTML = '<li>Brak słówek</li>';
        } else {
            words.forEach((word) => {
                // Dodaje słówko i tłumaczenie do listy
                const listItem = document.createElement('li');

                const wordContainer = document.createElement('span');
                wordContainer.style.marginRight = `10px`;
                wordContainer.innerHTML = `<strong>${word.word}</strong> - ${word.translation}`;

                const button = document.createElement('button');
                button.innerText = `Usuń słówko`;
                button.addEventListener('click', () => {
                    console.log(email, languageSelect.value, word.word);
                    deleteWord(email, languageSelect.value, word.word);
                })

                listItem.appendChild(wordContainer);
                listItem.appendChild(button);
                wordsList.appendChild(listItem);


                // Dodaje poziom opanowania do listy
                const listProficiency = document.createElement('li');
                listProficiency.innerHTML = `${word.proficiency}`;
                proficiencyList.appendChild(listProficiency);

                // Formatuje i dodaje datę ostatniego przeglądu do listy
                console.log("Ostatnio przeglądane: " + word.last_reviewed);
                const date = new Date(word.last_reviewed);
                const options = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };
                const formatter = new Intl.DateTimeFormat('en-GB', options);
                const listLastReviewed = document.createElement('li');
                listLastReviewed.innerHTML = `${formatter.format(date)}`;
                lastMemorizedList.appendChild(listLastReviewed);
            });
        }
    };

    /**
     * Obsługuje zmianę wybranego języka i ponowne pobranie danych.
     */
    languageSelect.addEventListener('change', () => {
        const selectedLanguage = languageSelect.value;
        console.log(selectedLanguage);
        fetchWords(email, selectedLanguage);
    });

    fetchWords(email, languageSelect.value);
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

function
deleteWord(email, language, word) {
    fetch('delete-word', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: email,
            language: language,
            word: word
        })
    })
    .then(res => res.json())
    .then((res) => {
        console.log(res);
        location.reload();
    }).catch(err => console.log(err));
}