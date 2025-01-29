const pool = require('../config/db');

/**
 * Rejestruje nowego użytkownika w bazie danych.
 *
 * @async
 * @function registerUser
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} req.body - Ciało żądania zawierające dane użytkownika.
 * @param {string} req.body.username - Nazwa użytkownika.
 * @param {string} req.body.email - Adres email użytkownika.
 * @param {string} req.body.password - Hasło użytkownika.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("registerUser", username, email, password);
    try {
        const result = await pool.query(
            "SELECT * from insert_user($1, $2, $3);",
            [username, email, password]
        );
        res.redirect('/login.html');
    } catch (err) {
        console.error(err.message);
        res.redirect(`/register.html?error=${err.message}`);
    }
};

/**
 * Loguje użytkownika na podstawie podanych danych logowania.
 *
 * @async
 * @function loginUser
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} req.body - Ciało żądania zawierające dane logowania.
 * @param {string} req.body.email - Adres email użytkownika.
 * @param {string} req.body.password - Hasło użytkownika.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM login_user($1, $2);",
            [email, password]
        );

        if (result.rows.length > 0) {
            res.cookie('email', email, {
                httpOnly: false,
                secure: false,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            res.cookie('username', result.rows[0].username, {
                httpOnly: false,
                secure: false,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            res.cookie('isAdmin', result.rows[0].is_admin, {
                httpOnly: false,
                secure: false,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            res.redirect('index.html');
        }
    } catch (err) {
        console.error(err.message);
        res.redirect('login.html?error=User%20not%20found');
    }
};

/**
 * Wylogowuje użytkownika, usuwając jego sesję.
 *
 * @async
 * @function logoutUser
 * @param {Object} req - Obiekt żądania HTTP.
 * @param {Object} res - Obiekt odpowiedzi HTTP.
 */
const logoutUser = async (req, res) => {
    try {
        req.session.destroy();
        res.json({ message: "Logged out" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to log out" });
    }
};

/**
 * Usuwa użytkownika
 * @async
 * @function deleteUser
 */
const deleteUser = async (req, res) => {
    const { email } = req.body;
    await pool.query(
        `SELECT * FROM delete_user($1)`,
        [email]
    )
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.error(err.message);
    })
}

module.exports = { registerUser, loginUser, logoutUser, deleteUser };
