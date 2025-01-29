/**
 * Funkcja wykonywana po załadowaniu okna przeglądarki.
 * Sprawdza obecność parametru `error` w adresie URL i wyświetla komunikat błędu, jeśli taki istnieje.
 */
window.onload = function() {
    /**
     * Pobiera parametry z adresu URL.
     * @type {URLSearchParams}
     */
    const params = new URLSearchParams(window.location.search);

    /**
     * Pobiera wartość parametru `error`.
     * @type {string|null}
     */
    const errorMessage = params.get('error');
    console.log(errorMessage);

    if (errorMessage) {
        /**
         * Element wyświetlający komunikat błędu.
         * @type {HTMLElement}
         */
        const errorDiv = document.getElementById('error');

        // Ustawia komunikat błędu i wyświetla go
        errorDiv.textContent = "Nie znaleziono użytkownika";
        errorDiv.style.display = 'block';
    }
}
