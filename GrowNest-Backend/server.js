const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Make the uploads folder publicly accessible to the React frontend for previews!
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage: storage });

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post('/api/register', (req, res) => {
    const { username, email, password_hash, name } = req.body;
    const sql = "INSERT INTO users (username, email, password_hash, name) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, email, password_hash, name], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'User registered!', userId: result.insertId });
    });
});

app.get('/api/user/:id', (req, res) => {
    const sql = "SELECT id, username, email, name, avatar FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
});

app.get('/api/user/:userId/children', (req, res) => {
    db.query("SELECT * FROM children WHERE user_id = ?", [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.post('/api/children', (req, res) => {
    const { user_id, name, dob, gender, height, weight, blood_group, allergies, medical_history } = req.body;
    const sql = `INSERT INTO children (user_id, name, dob, gender, height, weight, blood_group, allergies, medical_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const allergiesStr = allergies ? JSON.stringify(allergies) : '[]';
    db.query(sql, [user_id, name, dob, gender, height, weight, blood_group, allergiesStr, medical_history], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'Child profile created!', childId: result.insertId });
    });
});

app.put('/api/children/:id', (req, res) => {
    const { name, dob, gender, height, weight, bloodGroup, allergies, medicalHistory } = req.body;
    const sql = `UPDATE children SET name=?, dob=?, gender=?, height=?, weight=?, blood_group=?, allergies=?, medical_history=? WHERE id=?`;
    const allergiesStr = allergies ? JSON.stringify(allergies) : '[]';
    
    // Convert full ISO string from React to strict MySQL date
    const formattedDob = dob ? dob.split('T')[0] : null;

    db.query(sql, [name, formattedDob, gender, height, weight, bloodGroup, allergiesStr, medicalHistory, req.params.id], (err) => {
        if (err) {
            console.error("❌ DATABASE UPDATE ERROR:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Child profile updated!' });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT id, password_hash FROM users WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0 || results[0].password_hash !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful!', userId: results[0].id });
    });
});

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

app.get('/api/children/:childId/vaccinations', (req, res) => {
    const childId = req.params.childId;
    const checkSql = "SELECT * FROM vaccinations WHERE child_id = ? ORDER BY date ASC";
    db.query(checkSql, [childId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) return res.json(results);

        db.query("SELECT dob FROM children WHERE id = ?", [childId], (err, childRes) => {
            if (err || childRes.length === 0) return res.status(404).json({ error: 'Child not found' });
            
            const dob = childRes[0].dob;
            const template = [
                { name: 'BCG (Tuberculosis)', label: 'At Birth', days: 0 },
                { name: 'OPV 0 (Polio)', label: 'At Birth', days: 0 },
                { name: 'Hepatitis B - Birth dose', label: 'At Birth', days: 0 },
                { name: 'OPV 1', label: '6 Weeks', days: 42 },
                { name: 'Pentavalent 1', label: '6 Weeks', days: 42 },
                { name: 'Rotavirus (RVV) 1', label: '6 Weeks', days: 42 },
                { name: 'fIPV 1 (Polio)', label: '6 Weeks', days: 42 },
                { name: 'PCV 1 (Pneumococcal)', label: '6 Weeks', days: 42 },
                { name: 'OPV 2', label: '10 Weeks', days: 70 },
                { name: 'Pentavalent 2', label: '10 Weeks', days: 70 },
                { name: 'Rotavirus (RVV) 2', label: '10 Weeks', days: 70 },
                { name: 'OPV 3', label: '14 Weeks', days: 98 },
                { name: 'Pentavalent 3', label: '14 Weeks', days: 98 },
                { name: 'fIPV 2', label: '14 Weeks', days: 98 },
                { name: 'Rotavirus (RVV) 3', label: '14 Weeks', days: 98 },
                { name: 'PCV 2', label: '14 Weeks', days: 98 },
                { name: 'Measles & Rubella (MR) 1', label: '9 Months', days: 270 },
                { name: 'JE 1', label: '9 Months', days: 270 },
                { name: 'PCV Booster', label: '9 Months', days: 270 },
                { name: 'Vitamin A (1st dose)', label: '9 Months', days: 270 },
                { name: 'Measles & Rubella (MR) 2', label: '16 Months', days: 480 },
                { name: 'JE 2', label: '16 Months', days: 480 },
                { name: 'DPT Booster 1', label: '16 Months', days: 480 },
                { name: 'OPV Booster', label: '16 Months', days: 480 },
                { name: 'Vitamin A (2nd dose)', label: '16 Months', days: 480 },
                { name: 'DPT Booster 2', label: '5 Years', days: 1825 },
                { name: 'Tetanus & adult Diphtheria (Td)', label: '10 Years', days: 3650 },
                { name: 'Tetanus & adult Diphtheria (Td)', label: '16 Years', days: 5840 },
            ];

            const values = template.map(v => {
                const targetDate = addDays(dob, v.days);
                const status = new Date() > new Date(targetDate) ? 'missed' : 'upcoming';
                return [childId, v.name, v.label, targetDate, status];
            });

            db.query("INSERT INTO vaccinations (child_id, name, due_age, date, status) VALUES ?", [values], (err) => {
                if (err) return res.status(500).json({ error: 'Failed to generate schedule' });
                db.query(checkSql, [childId], (err, finalResults) => res.json(finalResults));
            });
        });
    });
});

app.put('/api/vaccinations/:id', (req, res) => {
    db.query("UPDATE vaccinations SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Vaccine updated!' });
    });
});


// ==========================================
// NEW MEDICAL RECORDS ROUTES
// ==========================================

// Upload a new record
app.post('/api/children/:childId/records', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { name, category } = req.body;
    const fileType = req.file.mimetype.includes('image') ? 'image' : 'pdf';
    const fileSize = (req.file.size / 1024 / 1024).toFixed(1) + ' MB';
    
    // Save metadata including the generated physical file name
    const sql = `INSERT INTO medical_records (child_id, name, file_type, file_size, record_date, category, file_name) VALUES (?, ?, ?, ?, CURDATE(), ?, ?)`;
    db.query(sql, [req.params.childId, name, fileType, fileSize, category, req.file.filename], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'Record saved!', id: result.insertId });
    });
});

// Get all records for a child
app.get('/api/children/:childId/records', (req, res) => {
    db.query("SELECT * FROM medical_records WHERE child_id = ? ORDER BY record_date DESC", [req.params.childId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Delete a record
app.delete('/api/records/:id', (req, res) => {
    db.query("SELECT file_name FROM medical_records WHERE id = ?", [req.params.id], (err, results) => {
        if (results.length > 0) {
            const filePath = path.join(__dirname, 'uploads', results[0].file_name);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Delete physical file
        }
        db.query("DELETE FROM medical_records WHERE id = ?", [req.params.id], (err) => {
            res.json({ message: 'Deleted successfully' });
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));