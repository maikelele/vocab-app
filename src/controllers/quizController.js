 const pool = require('../config/db');

/**
 * Pobiera najsłabsze słowo dla użytkownika na podstawie jego postępów w nauce.
 *
 * @async
 * @function getWeakestWord
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} req.body - Ciało żądania zawierające dane użytkownika.
 * @param {string} req.body.email - Adres email użytkownika.
 * @param {string} req.body.language - Wybrany język.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 * @returns {Object} JSON z najsłabszym słowem i dodatkowymi informacjami.
 */
const getWeakestWord = async (req, res) => {
    const { email, language } = req.body;
    console.log("Email: " + email + " Language: " + language);
    try {
        const result = await pool.query(
            `SELECT * FROM get_weakest_word($1, $2)`,
            [email, language],
        );
        console.log(result.rows[0]);
        return res.json(result.rows[0]); // Zwraca najsłabsze słowo w formacie JSON
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
    }
};

/**
 * Aktualizuje informacje o przeglądzie najsłabszego słowa użytkownika.
 *
 * @async
 * @function updateWeakestWord
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} req.body - Ciało żądania zawierające dane aktualizacji.
 * @param {string} req.body.word - Słowo, które użytkownik przeglądał.
 * @param {string} req.body.email - Adres email użytkownika.
 * @param {string} req.body.language - Wybrany język.
 * @param {boolean} req.body.succeeded - Czy odpowiedź użytkownika była poprawna.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 * @returns {Object} JSON z wynikami aktualizacji.
 */
const updateWeakestWord = async (req, res) => {
    const { word, email, language, succeeded } = req.body;
    console.log("Word: " + word + " Email: " + email + " Language: " + language);
    try {
        const result = await pool.query(
            `SELECT * FROM update_last_reviewed($1, $2, $3, $4)`,
            [word, email, language, succeeded],
        );
        console.log(result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating weakest word:', error.message);
        res.status(500).json({ error: 'Failed to update weakest word' });
    }
};

module.exports = { getWeakestWord, updateWeakestWord };
