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
 * Funkcja wykonywana po załadowaniu DOM.
 * Inicjalizuje funkcjonalności quizu i obsługę wybranego języka.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Email użytkownika pobrany z ciasteczek.
     * @type {string|null}
     */
    const email = getCookie('email');
    console.log("Quiz: " + email);

    /**
     * Element selektora języka.
     * @type {HTMLSelectElement}
     */
    const languageSelect = document.getElementById('languageSelect');

    /**
     * Przycisk rozpoczynający quiz.
     * @type {HTMLButtonElement}
     */
    const quizButton = document.getElementById('quizButton');

    /**
     * Obsługuje kliknięcie przycisku "Rozpocznij Quiz".
     * Sprawdza wybrany język i rozpoczyna quiz.
     */
    quizButton.addEventListener('click', async () => {
        console.log("Started button pressed");
        const selectedLanguage = languageSelect.value;
        console.log(selectedLanguage);

        if (!selectedLanguage) {
            alert('Proszę wybrać język.');
            return;
        }

        startQuiz(email, selectedLanguage);
    });

    /**
     * Rozpoczyna quiz dla użytkownika, pobierając słowo o najniższym poziomie opanowania.
     *
     * @param {string} email - Email użytkownika.
     * @param {string} selectedLanguage - Wybrany język.
     */
    const startQuiz = async (email, selectedLanguage) => {
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = '';

        try {
                const response = await fetch('get-weakest-word', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email, language: selectedLanguage }),
                });

                const data = await response.json();
                if (data.translation === null) {
                    quizContainer.innerHTML = `<p class="error">${data.word}</p>`;
                    return;
                } else if (data === "Brak słówek") {
                    quizContainer.innerHTML = `<p class="error">${data}</p>`;
                    return;
                }

                quizContainer.innerHTML = `
                    <p class="quiz-prompt">Podaj tłumaczenie dla słowa: <strong>${data.word}</strong></p>
                    <input type="text" id="user-translation" placeholder="Wpisz tłumaczenie" />
                    <button id="submit-answer">Sprawdź</button>
                    <p id="quiz-feedback" class="feedback"></p>
                `;

                document.getElementById('submit-answer').addEventListener('click', async () => {
                    console.log('Submitted!');
                    const userTranslation = document.getElementById('user-translation').value.trim();
                    const feedback = document.getElementById('quiz-feedback');
                console.log("userTranslation", userTranslation);

                if (!userTranslation) {
                    feedback.textContent = 'Proszę wprowadzić tłumaczenie.';
                    feedback.className = 'feedback error';
                    return;
                }

                let succeeded = false;
                if (userTranslation.toLowerCase() === data.translation.toLowerCase()) {
                    feedback.textContent = 'Brawo! Poprawna odpowiedź.';
                    feedback.className = 'feedback success';
                    succeeded = true;
                } else {
                    feedback.textContent = `Niestety, to niepoprawna odpowiedź. Poprawne tłumaczenie to: "${data.translation}".`;
                    feedback.className = 'feedback error';
                }

                try {
                    const updateResponse = await fetch('update-weakest-word', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            word: data.word,
                            email,
                            language: selectedLanguage,
                            succeeded: succeeded,
                        }),
                    });

                    console.log('Update response:', await updateResponse.json());
                } catch (error) {
                    console.error('Error updating word:', error);
                }

                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'quiz-actions';
                actionsContainer.innerHTML = `
                    <button id="continue-quiz">Kontynuuj</button>
                    <button id="end-quiz">Zakończ</button>
                `;

                quizContainer.appendChild(actionsContainer);

                document.getElementById('continue-quiz').addEventListener('click', () => {
                    startQuiz(email, selectedLanguage);
                });

                document.getElementById('end-quiz').addEventListener('click', () => {
                    quizContainer.innerHTML = '<p>Dziękujemy za udział w quizie!</p>';
                });
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            quizContainer.innerHTML = `<p class="error">Nie znaleziono słówek</p>`;
        }
    };
});
