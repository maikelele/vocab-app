/**
 * Funkcja wykonywana po załadowaniu okna przeglądarki.
 * Obsługuje wyświetlanie komunikatów błędu na podstawie parametrów w adresie URL.
 *
 * @param {Event} e - Obiekt zdarzenia ładowania okna.
 */
window.onload = (e) => {
    /**
     * Pobiera parametry z adresu URL.
     * @type {URLSearchParams}
     */
    const params = new URLSearchParams(window.location.search);

    /**
     * Pobiera wartość parametru `error` z adresu URL.
     * @type {string|null}
     */
    const errorMessage = params.get('error');
    console.log(errorMessage);

    if (errorMessage) {
        /**
         * Element, w którym wyświetlany jest komunikat błędu.
         * @type {HTMLElement}
         */
        const errorDiv = document.getElementById('error');

        errorDiv.textContent = `${errorMessage}`;
        errorDiv.style.display = 'block';
    }
};
