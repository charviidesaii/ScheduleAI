import sqlite3 from 'sqlite3';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DBSOURCE = path.join(__dirname, "db.sqlite");

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Professors Table
        db.run(`CREATE TABLE IF NOT EXISTS professors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            department TEXT
        )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Insert default professors if empty
                const insert = 'INSERT OR IGNORE INTO professors (name, department) VALUES (?,?)';
                db.run(insert, ["Dr. Sarah Miller", "Computer Science"]);
                db.run(insert, ["Prof. James Chen", "Mathematics"]);
                db.run(insert, ["Dr. Emily Johnson", "Physics"]);
                db.run(insert, ["Prof. Michael Ross", "History"]);
            }
        });

        // Courses Table
        db.serialize(() => {
            // db.run("DROP TABLE IF EXISTS courses"); // REMOVED to persist data
            db.run(`CREATE TABLE IF NOT EXISTS courses (
                id TEXT PRIMARY KEY,
                name TEXT,
                credits INTEGER,
                days TEXT,
                start_time TEXT,
                end_time TEXT
            )`);

            const insert = 'INSERT OR IGNORE INTO courses (id, name, credits, days, start_time, end_time) VALUES (?,?,?,?,?,?)';
            db.run(insert, ['CS101', 'Intro to Computer Science', 4, 'Mon, Wed', '10:00', '11:30']);
            db.run(insert, ['MATH201', 'Calculus II', 4, 'Tue, Thu', '13:00', '14:30']);
            db.run(insert, ['PHYS101', 'General Physics I', 4, 'Mon, Wed, Fri', '09:00', '10:00']);
            db.run(insert, ['ART101', 'Art History', 3, 'Fri', '10:00', '13:00']);
        });

        // Reviews Table
        db.run(`CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            professor_name TEXT,
            user_name TEXT,
            rating INTEGER,
            comment TEXT,
            course_id TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (!err) {
                // Table created
            }
        });
    }
});

export default db;
