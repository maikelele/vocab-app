/**
 * @description Ustawia połączenie z bazą danych.
 */

const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');

const PORT = 3000;

/**
 * Ustawia katalog publiczny jako źródło dla plików statycznych.
 * Pliki w tym katalogu (np. HTML, CSS, JavaScript) będą dostępne bezpośrednio w przeglądarce.
 */
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Middleware do obsługi danych w formacie JSON.
 * Umożliwia parsowanie treści żądań z typem `application/json`.
 */
app.use(express.json());

/**
 * Middleware do obsługi danych przesyłanych w formacie URL-encoded.
 * Przydaje się do obsługi danych formularzy.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware do obsługi tras zdefiniowanych w pliku `routes`.
 */
app.use(routes);

/**
 * Uruchamia serwer aplikacji Express na podanym porcie.
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
