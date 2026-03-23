require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in backend .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function initializeDatabase() {
    try {
        console.log("Initializing Supabase connection...");

        // Test the connection
        const { error: testError } = await supabase
            .from('patient')
            .select('id')
            .limit(1);


        if (testError) {
            if (testError.code === 'PGRST116') {
                // Table doesn't exist
                console.log("⚠️  WARNING: 'patient' table does not exist in Supabase!");
                console.log("Please create the table in your Supabase dashboard with this SQL:");
                console.log(`
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    disease TEXT NOT NULL,
    date DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    phone TEXT,
    email TEXT,
    address TEXT,
    blood_type TEXT,
    allergies TEXT,
    emergency_contact TEXT,
    medical_history TEXT,
    notes TEXT
);
                `);
                console.log("The server will continue but patient operations will fail until the table is created.");
            } else {
                console.error("Supabase connection test failed:", testError);
                throw testError;
            }
        } else {
            console.log("✅ Supabase connected successfully. 'patient' table is ready.");
        }

        return supabase;
    } catch (error) {
        console.error("❌ Supabase initialization failed:", error);
        throw error;
    }
}

module.exports = { initializeDatabase };