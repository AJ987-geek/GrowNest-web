const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.query("SHOW TABLES", (err, tables) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("TABLES:", tables);

    db.query("DESCRIBE medical_records", (err, cols) => {
        if (err) {
            console.log("No medical_records table found.");
        } else {
            console.log("COLUMNS IN medical_records:");
            console.log(cols);
        }
        process.exit(0);
    });
});
