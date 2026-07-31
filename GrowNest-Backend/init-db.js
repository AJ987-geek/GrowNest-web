require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Error:", err);
        process.exit(1);
    }
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS nutrition_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            child_id INT NOT NULL,
            log_date DATE NOT NULL,
            calories INT DEFAULT 0,
            protein INT DEFAULT 0,
            carbs INT DEFAULT 0,
            fats INT DEFAULT 0,
            water INT DEFAULT 0,
            meals_json JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_child_date (child_id, log_date)
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) console.error("Table Creation Error:", err);
        else console.log('Table nutrition_logs created or already exists.');
        process.exit(0);
    });
});
