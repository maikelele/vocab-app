const pool = require('../config/db');

const registerSummary = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM monthly_registration_summary;`
        );
        console.log(result.rows);
        res.json(result);
    } catch (error) {
        console.error(error.message);
    }
}

const loginSummary = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
            FROM monthly_login_summary;`
        );
        console.log(result.rows);
        res.json(result);
    } catch (error) {
        console.error(error.message);
    }
}

const revisionSummary = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
            FROM monthly_revision_summary;`
        );
        console.log(result.rows);
        res.json(result);
    } catch (error) {
        console.error(error.message);
    }
}

const userCount = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
        FROM user_summary;`
        );
        console.log(result.rows);
        res.json(result);
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = { registerSummary, loginSummary, revisionSummary, userCount };