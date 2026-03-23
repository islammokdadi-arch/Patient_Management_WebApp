function setupPatientRoutes(app, db) {
    app.post("/addPatient", (req, res) => {
        const { name, last_name, age, disease, dat, Gender, phone, email, address, blood_type, allergies, emergency_contact, medical_history, notes } = req.body;
        const sql = "INSERT INTO patient (Name, Last_Name, Age, Disease, Dat, Gender, Phone, Email, Address, Blood_Type, Allergies, Emergency_Contact, Medical_History, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, last_name, age, disease, dat, Gender, phone, email, address, blood_type, allergies, emergency_contact, medical_history, notes], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("Patient added successfully.");
        });
    });

    app.get("/getPatients", (req, res) => {
        db.query("SELECT * FROM patient", (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });

    app.put("/editPatient/:id", (req, res) => {
        const { id } = req.params;
        const { name, last_name, age, disease, dat, Gender, phone, email, address, blood_type, allergies, emergency_contact, medical_history, notes } = req.body;
        const sql = `
            UPDATE patient
            SET Name = ?, Last_Name = ?, Age = ?, Disease = ?, Dat = ?, Gender = ?, Phone = ?, Email = ?, Address = ?, Blood_Type = ?, Allergies = ?, Emergency_Contact = ?, Medical_History = ?, Notes = ?
            WHERE Id = ?
        `;
        db.query(sql, [name, last_name, age, disease, dat, Gender, phone, email, address, blood_type, allergies, emergency_contact, medical_history, notes, id], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send("Patient updated successfully.");
        });
    });

    app.get("/searchPatient/:query", (req, res) => {
        const { query } = req.params;
        const sql = "SELECT * FROM patient WHERE Name LIKE ? OR Last_Name LIKE ? OR Disease LIKE ? OR Email LIKE ?";
        db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });
}

module.exports = { setupPatientRoutes };