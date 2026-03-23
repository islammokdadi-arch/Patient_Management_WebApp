const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./config/database");
const { setupPatientRoutes } = require("./routes/patientRoutes");

const app = express();
app.use(cors());
app.use(express.json());

initializeDatabase((db) => {
    setupPatientRoutes(app, db);

    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
});
