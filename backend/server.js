const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./config/database");
const { setupPatientRoutes } = require("./routes/patientRoutes");

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
    try {
        const supabase = await initializeDatabase();
        setupPatientRoutes(app, supabase);

        app.listen(5001, () => {
            console.log("Server running on port 5001 with Supabase");
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
