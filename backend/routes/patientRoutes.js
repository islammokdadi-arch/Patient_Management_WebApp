function setupPatientRoutes(app, supabase) {
    app.post("/addPatient", async (req, res) => {
        try {
            const { name, last_name, age, disease, date, dat, gender, Gender, phone, email, address, blood_type, allergies, emergency_contact, medical_history, notes } = req.body;

            const dateValue = date ?? dat;
            const genderValue = gender ?? Gender;

            const { data, error } = await supabase
                .from('patient')
                .insert([{
                    name: name,
                    last_name: last_name,
                    age: parseInt(age),
                    disease: disease,
                    date: dateValue,
                    gender: genderValue,
                    phone: phone,
                    email: email,
                    address: address,
                    blood_type: blood_type,
                    allergies: allergies,
                    emergency_contact: emergency_contact,
                    medical_history: medical_history,
                    notes: notes
                }])
                .select();

            if (error) {
                console.error('Supabase insert error:', error);
                if (error.code === 'PGRST116') {
                    return res.status(500).send("Patient table does not exist. Please create it in Supabase first.");
                }
                return res.status(500).send(error.message);
            }

            console.log('✅ Patient added successfully to Supabase:', data);
            return res.json({ message: 'Patient added successfully.', patient: data[0] });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).send("Internal server error");
        }
    });

    app.get("/getPatients", async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('patient')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('Supabase select error:', error);
                if (error.code === 'PGRST116') {
                    return res.status(500).send("Patient table does not exist. Please create it in Supabase first.");
                }
                return res.status(500).send(error.message);
            }

            res.json(data.map(patient => ({
                Id: patient.id,
                Name: patient.name,
                Last_Name: patient.last_name,
                Age: patient.age,
                Disease: patient.disease,
                Dat: patient.date || patient.dat,
                Gender: patient.gender || patient.Gender,
                Phone: patient.phone,
                Email: patient.email,
                Address: patient.address,
                Blood_Type: patient.blood_type,
                Allergies: patient.allergies,
                Emergency_Contact: patient.emergency_contact,
                Medical_History: patient.medical_history,
                Notes: patient.notes
            })));
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).send("Internal server error");
        }
    });

    app.put("/editPatient/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { name, last_name, age, disease, date, dat, gender, Gender, phone, email, address, blood_type, allergies, emergency_contact, medical_history, notes } = req.body;

            const dateValue = date ?? dat;
            const genderValue = gender ?? Gender;

            const { data, error } = await supabase
                .from('patient')
                .update({
                    name: name,
                    last_name: last_name,
                    age: parseInt(age),
                    disease: disease,
                    date: dateValue,
                    gender: genderValue,
                    phone: phone,
                    email: email,
                    address: address,
                    blood_type: blood_type,
                    allergies: allergies,
                    emergency_contact: emergency_contact,
                    medical_history: medical_history,
                    notes: notes
                })
                .eq('id', parseInt(id))
                .select();

            if (error) {
                console.error('Supabase update error:', error);
                if (error.code === 'PGRST116') {
                    return res.status(500).send("Patient table does not exist. Please create it in Supabase first.");
                }
                return res.status(500).send(error.message);
            }

            console.log('✅ Patient updated successfully in Supabase:', data);
            return res.json({ message: 'Patient updated successfully.', patient: data[0] });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).send("Internal server error");
        }
    });

    app.get("/searchPatient/:query", async (req, res) => {
        try {
            const { query } = req.params;

            const { data, error } = await supabase
                .from('patient')
                .select('*')
                .or(`name.ilike.%${query}%,last_name.ilike.%${query}%,disease.ilike.%${query}%,email.ilike.%${query}%`);

            if (error) {
                console.error('Supabase search error:', error);
                if (error.code === 'PGRST116') {
                    return res.status(500).send("Patient table does not exist. Please create it in Supabase first.");
                }
                return res.status(500).send(error.message);
            }

            res.json(data.map(patient => ({
                Id: patient.id,
                Name: patient.name,
                Last_Name: patient.last_name,
                Age: patient.age,
                Disease: patient.disease,
                Dat: patient.date || patient.dat,
                Gender: patient.gender || patient.Gender,
                Phone: patient.phone,
                Email: patient.email,
                Address: patient.address,
                Blood_Type: patient.blood_type,
                Allergies: patient.allergies,
                Emergency_Contact: patient.emergency_contact,
                Medical_History: patient.medical_history,
                Notes: patient.notes
            })));
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).send("Internal server error");
        }
    });
}

module.exports = { setupPatientRoutes };