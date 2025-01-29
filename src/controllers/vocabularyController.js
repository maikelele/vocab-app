const pool = require('../config/db');

/**
 * Dodaje nowe słowo do słownika użytkownika.
 *
 * @async
 * @function addWord
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} req.body - Ciało żądania zawierające dane słowa.
 * @param {string} req.body.word - Dodawane słowo.
 * @param {string} req.body.translation - Tłumaczenie słowa.
 * @param {string} req.body.email - Adres email użytkownika.
 * @param {string} req.body.language - Wybrany język.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
const addWord = async (req, res) => {
    const { word, translation, email, language } = req.body;
    console.log("Add word: " + word, translation, email, language);

    try {
        const result = await pool.query(
            "SELECT * from insert_word($1, $2, $3, $4);",
            [word, translation, email, language]
        );
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

/**
 * Pobiera listę słówek użytkownika dla wybranego języka.
 *
 * @async
 * @function vocabularyList
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} req.body - Ciało żądania zawierające dane użytkownika.
 * @param {string} req.body.email - Adres email użytkownika.
 * @param {string} req.body.language - Wybrany język.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
const vocabularyList = async (req, res) => {
    try {
        const { email, language } = req.body;
        console.log("Email: ", email);
        console.log("Language: ", language);

        const result = await pool.query(
            'select * from get_words_by_user_and_language($1, $2)',
            [email, language]
        );
        console.log("Backend Response:", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

/**
 * Liczy liczbę przeglądów słówek użytkownika w danym dniu i języku.
 *
 * @async
 * @function countReviews
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} req.body - Ciało żądania zawierające dane zapytania.
 * @param {string} req.body.email - Adres email użytkownika.
 * @param {string} req.body.date - Data przeglądów (format YYYY-MM-DD).
 * @param {string|null} req.body.language - Wybrany język (lub null dla wszystkich języków).
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
const countReviews = async (req, res) => {
    const { email, date, language } = req.body;
    console.log("countReviews: Email: ", email, " Date: ", date, " Language: ", language);
    try {
        const result = await pool.query(
            `SELECT * FROM count_reviews($1, $2, $3)`,
            [email, date, language]
        );
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

/**
 * Pobiera listę najlepszych użytkowników z ostatnich 7 dni.
 *
 * @async
 * @function getTopUsers
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
const getTopUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * from top_users_last_7_days`
        );
        console.log("getTopUsers(): ", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

const deleteWord = async (req, res) => {
    try {
        const { email, language, word } = req.body;
        const result = await pool.query(
            `SELECT * FROM delete_word_by_user_and_language($1, $2, $3)`,
            [email, word, language]
        );
        console.log("deleteWord result: " + JSON.stringify(result.rows[0].delete_word_by_user_and_language));
        res.json(JSON.stringify(result.rows[0].delete_word_by_user_and_language));
    } catch (error) {

    }
}

module.exports = { addWord, vocabularyList, countReviews, getTopUsers, deleteWord };
