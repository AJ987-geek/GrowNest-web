const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();
app.use(cors());
app.use(express.json());

// Make the uploads folder publicly accessible to the React frontend for previews!
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
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

// Update child profile AND automatically save a growth record
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

        // --- NEW: Automatically log the height and weight to growth_records ---
        // Get the current month name (e.g., "Jul")
        const currentMonth = new Date().toLocaleString('default', { month: 'short' });

        db.query(
            "INSERT INTO growth_records (child_id, month, height, weight) VALUES (?, ?, ?, ?)",
            [req.params.id, currentMonth, height, weight]
        );

        res.json({ message: 'Child profile updated!' });
    });
});

// NEW: Fetch growth records for the dashboard chart
app.get('/api/children/:childId/growth', (req, res) => {
    // Get the last 12 records ordered chronologically
    db.query("SELECT month, height, weight FROM growth_records WHERE child_id = ? ORDER BY recorded_at ASC LIMIT 12", [req.params.childId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        res.json(results);
    });
});

// NEW: POST manual growth record
app.post('/api/children/:childId/growth', (req, res) => {
    const { month, height, weight } = req.body;
    if (!month || !height || !weight) return res.status(400).json({ error: 'Missing fields' });
    const sql = "INSERT INTO growth_records (child_id, month, height, weight) VALUES (?, ?, ?, ?)";
    db.query(sql, [req.params.childId, month, height, weight], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Synchronize with the main child profile
        const updateSql = "UPDATE children SET height = ?, weight = ? WHERE id = ?";
        db.query(updateSql, [height, weight, req.params.childId], (updateErr) => {
            if (updateErr) console.error("Failed to sync profile:", updateErr);
            res.json({ message: 'Growth record added and profile synced!' });
        });
    });
});

// NEW: Reset growth records
app.delete('/api/children/:childId/growth', (req, res) => {
    const sql = "DELETE FROM growth_records WHERE child_id = ?";
    db.query(sql, [req.params.childId], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Growth records reset!' });
    });
});

// NEW: GET last 7 days of nutrition data
app.get('/api/children/:childId/nutrition', (req, res) => {
    const sql = `
        SELECT DATE_FORMAT(log_date, '%a') as day, calories, protein, carbs, fats, water
        FROM nutrition_logs 
        WHERE child_id = ? 
        ORDER BY log_date DESC 
        LIMIT 7
    `;
    db.query(sql, [req.params.childId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results.reverse());
    });
});

// NEW: Reset today's nutrition log
app.delete('/api/children/:childId/nutrition/today', (req, res) => {
    const sql = "UPDATE nutrition_logs SET calories=0, protein=0, carbs=0, fats=0, water=0 WHERE child_id = ? AND log_date = CURDATE()";
    db.query(sql, [req.params.childId], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Reset successful' });
    });
});

// NEW: POST /nutrition/scan (AI Meal Scanner)
app.post('/api/children/:childId/nutrition/scan', async (req, res) => {
    const { meal_description } = req.body;
    if (!meal_description) return res.status(400).json({ error: 'Missing meal_description' });

    try {
        const prompt = `You are an expert nutritionist and a strict JSON API. Parse this meal: "${meal_description}".
CRITICAL INSTRUCTION: You MUST calculate the total nutritional value based EXACTLY on the quantity, weight, or portion size specified. For example, if the user specifies "3 apples", you must multiply the macros of 1 apple by 3. If they say "500g of chicken", calculate the macros for exactly 500g.
Return ONLY a valid JSON object with integer estimates for: calories, protein, carbs, fats, water.
If water is mentioned, estimate in glasses (e.g. 1 glass = 1). If not mentioned, return 0 for water.
Example format: {"calories": 350, "protein": 12, "carbs": 45, "fats": 8, "water": 1}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });

        const macros = JSON.parse(chatCompletion.choices[0].message.content);

        // Upsert into nutrition_logs for today
        const sql = `
            INSERT INTO nutrition_logs (child_id, log_date, calories, protein, carbs, fats, water)
            VALUES (?, CURDATE(), ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            calories = calories + VALUES(calories),
            protein = protein + VALUES(protein),
            carbs = carbs + VALUES(carbs),
            fats = fats + VALUES(fats),
            water = water + VALUES(water)
        `;
        db.query(sql, [req.params.childId, macros.calories, macros.protein, macros.carbs, macros.fats, macros.water || 0], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Meal logged!', macros });
        });
    } catch (error) {
        console.error("AI Scan Error:", error);
        res.status(500).json({ error: 'AI Processing failed' });
    }
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

const vaccineSeries = {
    'OPV 1': { next: 'OPV 2', minGapDays: 28 },
    'OPV 2': { next: 'OPV 3', minGapDays: 28 },
    'OPV 3': { next: 'OPV Booster', minGapDays: 28 },
    'Pentavalent 1': { next: 'Pentavalent 2', minGapDays: 28 },
    'Pentavalent 2': { next: 'Pentavalent 3', minGapDays: 28 },
    'Rotavirus (RVV) 1': { next: 'Rotavirus (RVV) 2', minGapDays: 28 },
    'Rotavirus (RVV) 2': { next: 'Rotavirus (RVV) 3', minGapDays: 28 },
    'fIPV 1 (Polio)': { next: 'fIPV 2', minGapDays: 28 },
    'PCV 1 (Pneumococcal)': { next: 'PCV 2', minGapDays: 28 },
    'PCV 2': { next: 'PCV Booster', minGapDays: 28 },
    'Measles & Rubella (MR) 1': { next: 'Measles & Rubella (MR) 2', minGapDays: 28 },
    'JE 1': { next: 'JE 2', minGapDays: 90 },
    'DPT Booster 1': { next: 'DPT Booster 2', minGapDays: 182 }
};

app.put('/api/vaccinations/:id', (req, res) => {
    const { status, actual_date, batch_number, clinic, notes } = req.body;
    
    // 1. Update the current vaccine
    const updateSql = `UPDATE vaccinations SET status = ?, actual_date = ?, batch_number = ?, clinic = ?, notes = ? WHERE id = ?`;
    db.query(updateSql, [status, actual_date || null, batch_number || null, clinic || null, notes || null, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        // 2. Fetch the current vaccine to get its name and child_id
        db.query("SELECT name, child_id FROM vaccinations WHERE id = ?", [req.params.id], (err, results) => {
            if (err || results.length === 0 || status !== 'completed' || !actual_date) {
                return res.json({ message: 'Vaccine updated!' });
            }
            
            const currentVaccine = results[0];
            const seriesInfo = vaccineSeries[currentVaccine.name];
            
            if (seriesInfo) {
                // 3. Find the next vaccine in the series
                db.query("SELECT id, original_date, date FROM vaccinations WHERE child_id = ? AND name = ?", [currentVaccine.child_id, seriesInfo.next], (err, nextResults) => {
                    if (err || nextResults.length === 0) return res.json({ message: 'Vaccine logged!' });
                    const nextVaccine = nextResults[0];
                    
                    // 4. Recalculate nextDueDate = max(original_date, actual_date + minGapDays)
                    const actualDateObj = new Date(actual_date);
                    const minAllowedDate = new Date(actualDateObj);
                    minAllowedDate.setDate(minAllowedDate.getDate() + seriesInfo.minGapDays);
                    
                    // Use original_date if it exists, otherwise fallback to its current date
                    const originalDateObj = new Date(nextVaccine.original_date || nextVaccine.date);
                    
                    const nextDueDate = minAllowedDate > originalDateObj ? minAllowedDate : originalDateObj;
                    const nextDueDateStr = nextDueDate.toISOString().split('T')[0];
                    
                    // 5. Update next vaccine's date
                    db.query("UPDATE vaccinations SET date = ? WHERE id = ?", [nextDueDateStr, nextVaccine.id], (err) => {
                        res.json({ message: 'Vaccine logged & downstream recalculated!' });
                    });
                });
            } else {
                res.json({ message: 'Vaccine logged!' });
            }
        });
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

// ==========================================
// NEW: ACTIVITIES ROUTES
// ==========================================
app.post('/api/children/:childId/activities', (req, res) => {
    const { activity_name, category } = req.body;
    if (!activity_name || !category) return res.status(400).json({ error: 'Missing fields' });
    const sql = "INSERT INTO activity_logs (child_id, activity_name, category, log_date) VALUES (?, ?, ?, CURDATE())";
    db.query(sql, [req.params.childId, activity_name, category], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Activity logged!' });
    });
});

app.get('/api/children/:childId/activities', (req, res) => {
    // Fetch last 7 days of activities
    const sql = "SELECT * FROM activity_logs WHERE child_id = ? AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) ORDER BY log_date DESC, created_at DESC";
    db.query(sql, [req.params.childId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
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
app.delete('/api/children/:childId/activities/:activityId', (req, res) => {
    const sql = "DELETE FROM activity_logs WHERE id = ? AND child_id = ?";
    db.query(sql, [req.params.activityId, req.params.childId], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Activity deleted!' });
    });
});
// ==========================================
// NEW COMMUNITY ROUTES
// ==========================================

// 1. Get all posts with author and like count
app.get('/api/posts', (req, res) => {
    const sql = `
        SELECT p.id, p.title, p.content, p.created_at, u.name, u.username, u.avatar, p.user_id,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// 2. Create a new post
app.post('/api/posts', (req, res) => {
    const { user_id, title, content } = req.body;
    db.query("INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)", [user_id, title, content], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Post created!', id: result.insertId });
    });
});

// 3. Delete a post
app.delete('/api/posts/:id', (req, res) => {
    db.query("DELETE FROM posts WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Post deleted' });
    });
});

// 4. Like / Unlike a post
app.post('/api/posts/:id/like', (req, res) => {
    const { user_id } = req.body;
    const post_id = req.params.id;

    db.query("SELECT * FROM likes WHERE post_id = ? AND user_id = ?", [post_id, user_id], (err, results) => {
        if (results.length > 0) {
            db.query("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [post_id, user_id], () => res.json({ message: 'Unliked' }));
        } else {
            db.query("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [post_id, user_id], () => res.json({ message: 'Liked' }));
        }
    });
});

// 5. Get comments for a post
app.get('/api/posts/:id/comments', (req, res) => {
    const sql = `
        SELECT c.id, c.content, c.created_at, u.name, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// 6. Add a comment
app.post('/api/posts/:id/comments', (req, res) => {
    const { user_id, content } = req.body;
    db.query("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", [req.params.id, user_id, content], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Comment added' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));