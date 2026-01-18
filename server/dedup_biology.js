import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    // 1. We want to keep 'BIOLOGY' (clean ID) but use 'Professor Bill Nye' (from the other duplicate)
    // The duplicate course is 'BIOLOGY ' (with space)

    const correctId = 'BIOLOGY';
    const badId = 'BIOLOGY ';
    const correctProf = 'Professor Bill Nye';

    // Update the good course with the correct professor
    // (Professor association is largely via reviews in this app structure, but let's clean up refs)

    // 2. Move reviews from 'BIOLOGY ' to 'BIOLOGY'
    // Update reviews where course_id is badId to correctId
    // AND set professor_name to 'Professor Bill Nye'
    db.run("UPDATE reviews SET course_id = ?, professor_name = ? WHERE course_id = ?",
        [correctId, correctProf, badId],
        function (err) {
            if (err) console.error("Error moving BIOLOGY reviews:", err);
            else console.log(`Moved reviews from '${badId}' to '${correctId}'. Changes: ${this.changes}`);
        }
    );

    // 3. Update ANY existing 'BIOLOGY' reviews to be 'Professor Bill Nye' (replacing Sprout)
    db.run("UPDATE reviews SET professor_name = ? WHERE course_id = ? AND professor_name != ?",
        [correctProf, correctId, correctProf],
        function (err) {
            if (err) console.error("Error updating existing BIOLOGY reviews:", err);
            else console.log(`Updated existing BIOLOGY reviews to Bill Nye. Changes: ${this.changes}`);
        }
    );

    // 4. Delete the duplicate course 'BIOLOGY '
    db.run("DELETE FROM courses WHERE id = ?", [badId], function (err) {
        if (err) console.error("Error deleting duplicate course:", err);
        else console.log(`Deleted duplicate course '${badId}'. Changes: ${this.changes}`);
    });

    // 5. Delete Professor Sprout (optional cleanup, if only used for Biology)
    db.run("DELETE FROM professors WHERE name = 'Professor Sprout'", function (err) {
        if (err) console.error("Error removing Sprout:", err);
        else console.log(`Removed Professor Sprout. Changes: ${this.changes}`);
    });

    // 6. Ensure Professor Bill Nye exists in professors table (he seemed to be there, id 35, but let's be safe)
    db.run("INSERT OR IGNORE INTO professors (name, department) VALUES (?, ?)", [correctProf, "Biology"], function (err) {
        if (err) console.error("Error ensuring Bill Nye:", err);
        else console.log(`Ensured Bill Nye exists. Changes: ${this.changes}`);
    });

});
