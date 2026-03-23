const mysql = require("mysql");

const DB_NAME = "Patient_Systm";

function initializeDatabase(callback) {
    const initialDb = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "islam2004***"
    });

    initialDb.connect(err => {
        if (err) {
            console.error("Initial DB connection failed: " + err.stack);
            return;
        }
        console.log("Connected to MySQL server.");

        initialDb.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``, (err) => {
            if (err) {
                console.error("Failed to create database:", err);
                return;
            }
            console.log(`Database '${DB_NAME}' is ready.`);

            const db = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "islam2004***",
                database: DB_NAME
            });

            db.connect(err => {
                if (err) {
                    console.error("Final DB connection failed: " + err.stack);
                    return;
                }
                console.log("Connected to Patient_Systm.");

                // Drop and recreate table to ensure all columns exist
                db.query("DROP TABLE IF EXISTS patient", (err) => {
                    if (err) console.error("Failed to drop table:", err);

                    const createTableQuery = `
                    CREATE TABLE patient (
                        Id INT AUTO_INCREMENT PRIMARY KEY,
                        Name VARCHAR(255) NOT NULL,
                        Last_Name VARCHAR(255) NOT NULL,
                        Age INT NOT NULL,
                        Disease VARCHAR(255) NOT NULL,
                        Dat DATE NOT NULL,
                        Gender ENUM('Male', 'Female') NOT NULL,
                        Phone VARCHAR(20),
                        Email VARCHAR(255),
                        Address TEXT,
                        Blood_Type VARCHAR(10),
                        Allergies TEXT,
                        Emergency_Contact VARCHAR(255),
                        Medical_History TEXT,
                        Notes TEXT
                        )
                    `;
                    db.query(createTableQuery, err => {
                        if (err) console.error("Failed to create 'patient' table:", err);
                        else console.log("'patient' table created successfully.");

                        callback(db);
                    });
                });
            });
        });
    });
}

module.exports = { initializeDatabase };