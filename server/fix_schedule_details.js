import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    // 1. Update POTIONS time
    // ID is "POTIONS " (with space) based on previous findings
    db.run("UPDATE courses SET start_time = '8:00 am', end_time = '10:00 am' WHERE id = 'POTIONS '", function (err) {
        if (err) console.error("Error updating Potions:", err);
        else console.log(`Updated Potions time. Changes: ${this.changes}`);
    });

    // 2. Ensure BIOLOGY course exists
    // Using "BIOLOGY" as ID (trimmed)
    const bioId = "BIOLOGY";
    const bioName = "Biology 203";

    db.run("INSERT OR IGNORE INTO courses (id, name, credits, days, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
        [bioId, bioName, 3, "Tues, Thurs", "12:30", "14:45"],
        function (err) {
            if (err) console.error("Error creating Biology:", err);
            else console.log(`Ensured Biology course. Changes: ${this.changes}`);
        }
    );

    // 3. Ensure Professor Sprout exists for Biology
    const profName = "Professor Sprout";
    db.run("INSERT OR IGNORE INTO professors (name, department) VALUES (?, ?)", [profName, "Biology"], function (err) {
        if (err) console.error("Error adding Sprout:", err);
        else console.log(`Ensured Professor Sprout. Changes: ${this.changes}`);
    });

    // 4. Link Review to Professor Sprout for Biology
    // We need to check if a review exists for BIOLOGY, if so, update its professor name
    // Or insert a new review if none exists to establish the link
    db.get("SELECT * FROM reviews WHERE course_id = ?", [bioId], (err, row) => {
        if (!row) {
            db.run("INSERT INTO reviews (professor_name, user_name, rating, comment, course_id) VALUES (?, ?, ?, ?, ?)",
                [profName, "You", 4, "Great class!", bioId],
                function (err) {
                    if (err) console.error("Error adding Bio review:", err);
                    else console.log("Added review for Biology to link professor.");
                }
            );
        } else {
            console.log("Existing Bio review found:", row);
            if (row.professor_name !== profName) {
                db.run("UPDATE reviews SET professor_name = ? WHERE course_id = ?", [profName, bioId], function (err) {
                    console.log(`Updated Bio review professor to Sprout. Changes: ${this.changes}`);
                });
            }
        }
    });

    // 5. Check POTIONS review linkage
    db.all("SELECT * FROM reviews WHERE course_id = 'POTIONS '", (err, rows) => {
        console.log("POTIONS Reviews:", rows);
    });
});
