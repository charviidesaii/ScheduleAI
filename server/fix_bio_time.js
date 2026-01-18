import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    const bioId = 'BIOLOGY';
    // Update time to 12-hour format with am/pm
    db.run("UPDATE courses SET start_time = '12:30 pm', end_time = '2:45 pm' WHERE id = ?",
        [bioId],
        function (err) {
            if (err) console.error("Error updating Biology time:", err);
            else console.log(`Updated Biology time to 12h format. Changes: ${this.changes}`);
        }
    );
});
