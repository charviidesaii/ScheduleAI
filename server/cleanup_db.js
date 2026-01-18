import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
    // 1. Delete Verified Prof
    db.run("DELETE FROM professors WHERE name = 'Verified Prof'", function (err) {
        if (err) console.error("Error deleting Verified Prof:", err);
        else console.log(`Deleted Verified Prof. Changes: ${this.changes}`);
    });

    // 2. Debug Snape
    const profName = 'Professor Snape';

    // Get Prof ID
    db.get("SELECT * FROM professors WHERE name = ?", [profName], (err, prof) => {
        if (err) console.error(err);
        if (prof) {
            console.log("Snape Prof:", prof);

            // Get Reviews
            db.all("SELECT * FROM reviews WHERE professor_name = ?", [profName], (err, reviews) => {
                console.log("Snape Reviews:", reviews);

                if (reviews.length > 0) {
                    const courseId = reviews[0].course_id;
                    console.log("Searching for Course ID:", `"${courseId}"`); // Quote to see spaces

                    // Get Course
                    db.get("SELECT * FROM courses WHERE id = ?", [courseId], (err, course) => {
                        console.log("Found Course:", course);
                    });

                    // Check if course exists with stripped ID?
                    db.get("SELECT * FROM courses WHERE id = ?", [courseId.trim()], (err, course) => {
                        console.log("Found Course (Trimmed):", course);
                    });
                }
            });
        } else {
            console.log("Professor Snape not found");
        }
    });
});
