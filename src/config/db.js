const { Pool } = require("pg");
require("dotenv").config();

/**
 * Konfiguruje połączenie z bazą danych PostgreSQL.
 * Używa biblioteki `pg` do zarządzania pulą połączeń.
 * Pobiera dane dostępowe do bazy danych z pliku `.env`.
 */
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
    },
});

/**
 * Testuje połączenie z bazą danych PostgreSQL.
 * Wyświetla informacje o bieżącej bazie danych, użytkowniku i schemacie.
 *
 * @async
 * @function
 */
async function testConnection() {
    try {
        /**
         * Nawiązuje połączenie z bazą danych.
         * @type {PoolClient}
         */
        const client = await pool.connect();
        console.log("Connected to the database successfully!");


        const result = await client.query("SELECT current_database(), current_user, current_schema;");
        console.log("Current Database:", result.rows[0].current_database);
        console.log("Current User:", result.rows[0].current_user);
        console.log("Current Schema:", result.rows[0].current_schema);

        client.release();
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
}


testConnection();

module.exports = pool;
