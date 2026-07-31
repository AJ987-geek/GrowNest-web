const mysql = require('mysql2');
require('dotenv').config({ path: 'E:/GrowNest/GrowNest-Backend/.env' });
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

const sql = `ALTER TABLE vaccinations 
  ADD COLUMN actual_date DATE, 
  ADD COLUMN batch_number VARCHAR(255), 
  ADD COLUMN clinic VARCHAR(255), 
  ADD COLUMN original_date DATE;`;

db.query(sql, (err, result) => {
  if (err && !err.message.includes('Duplicate column')) throw err;
  console.log('Columns added successfully.');
  
  db.query('UPDATE vaccinations SET original_date = date WHERE original_date IS NULL', (err) => {
     if (err) throw err;
     console.log('original_date populated');
     db.end();
  });
});
