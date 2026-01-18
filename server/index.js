import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3001; // Running on port 3001 to avoid conflict with Vite (3000/5173)

app.use(cors());
app.use(express.json());

// Get all professors
app.get('/api/professors', (req, res) => {
    const sql = "SELECT * FROM professors";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Add a new professor
app.post('/api/professors', (req, res) => {
    const { name, department } = req.body;
    const sql = 'INSERT INTO professors (name, department) VALUES (?,?)';
    const params = [name, department];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, name, department }
        });
    });
});

// Get all courses
app.get('/api/courses', (req, res) => {
    const sql = "SELECT * FROM courses";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Add a new course
app.post('/api/courses', (req, res) => {
    const { id, name, credits, days, start_time, end_time } = req.body;
    const sql = 'INSERT INTO courses (id, name, credits, days, start_time, end_time) VALUES (?,?,?,?,?,?)';
    const params = [id, name, credits, days, start_time, end_time];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id, name, credits, days, start_time, end_time }
        });
    });
});

// Get reviews (with optional filtering by professor)
app.get('/api/reviews', (req, res) => {
    const sql = "SELECT * FROM reviews ORDER BY timestamp DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Add a new review
app.post('/api/reviews', (req, res) => {
    const { professor_name, user_name, rating, comment, course_id } = req.body;
    const sql = 'INSERT INTO reviews (professor_name, user_name, rating, comment, course_id) VALUES (?,?,?,?,?)';
    const params = [professor_name, user_name, rating, comment, course_id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, professor_name, user_name, rating, comment, course_id }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
