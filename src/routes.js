/**
 * @module routes
 * @description Konfiguruje trasy dla aplikacji.
 */

const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, deleteUser } = require("./controllers/authController");
const { addWord, vocabularyList, countReviews, getTopUsers, deleteWord } = require("./controllers/vocabularyController");
const { getWeakestWord, updateWeakestWord } = require("./controllers/quizController");
const { registerSummary, loginSummary, revisionSummary, userCount } = require("./controllers/adminController");


/**
 * Rejestruje nowego użytkownika.
 * @name POST /register
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/register", registerUser);

/**
 * Loguje użytkownika.
 * @name POST /login
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/login", loginUser);

/**
 * Wylogowuje użytkownika.
 * @name POST /logout
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/logout", logoutUser);

/**
 * Dodaje nowe słowo do słownika.
 * @name POST /add-word
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/add-word", addWord);

/**
 * Pobiera listę słów w słowniku użytkownika.
 * @name POST /vocabulary-list
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/vocabulary-list", vocabularyList);

/**
 * Zlicza przeglądy słówek użytkownika.
 * @name POST /count-reviews
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/count-reviews", countReviews);

/**
 * Pobiera listę najlepszych użytkowników.
 * @name GET /get-top-users
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.get("/get-top-users", getTopUsers);

/**
 * Pobiera najsłabsze słowo użytkownika.
 * @name POST /get-weakest-word
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/get-weakest-word", getWeakestWord);

/**
 * Aktualizuje informacje o najsłabszym słowie.
 * @name POST /update-weakest-word
 * @function
 * @memberof module:routes
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
router.post("/update-weakest-word", updateWeakestWord);

/**
 * Usuwa wybrane słowo dla użytkownika i języka
 * @name POST /delete-word
 * @function
 * @memberOf module:routes
 *
 */
router.post("/delete-word", deleteWord);

/**
 * Usuwa użytkownika z bazy danych
 */
router.post("/delete-account", deleteUser);

router.get("/summary-registrations", registerSummary);

router.get("/summary-logins", loginSummary);

router.get("/summary-revisions", revisionSummary);

router.get("/user-count", userCount);

module.exports = router;
