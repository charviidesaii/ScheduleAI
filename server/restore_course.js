import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    // Restore Potions course with the ID expected by the review ("POTIONS ")
    const sql = "INSERT OR IGNORE INTO courses (id, name, credits, days, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)";

    // Using "POTIONS " (with space) as ID matches the review data
    db.run(sql, ["POTIONS ", "Potions 101", 3, "Mon, Wed", "10:00", "11:30"], function (err) {
        if (err) console.error(err);
        else console.log(`Restored POTIONS course. Changes: ${this.changes}`);
    });
});
