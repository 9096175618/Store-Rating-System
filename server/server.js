const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const storeRoutes = require("./routes/stores");
const ratingRoutes = require("./routes/ratings");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// User management
app.use("/api/users", userRoutes);

// Store management
app.use("/api/stores", storeRoutes);

// Rating management
app.use("/api/ratings", ratingRoutes);


// ==========================================
// HOME ROUTE
// ==========================================
app.get("/", (req, res) => {
    res.send("Store Rating API is running");
});


// ==========================================
// TEST DATABASE CONNECTION
// ==========================================
app.get("/api/test-db", (req, res) => {

    db.query("SELECT 1 AS test", (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message
            });
        }

        res.json({
            message: "Database connected successfully",
            result: result
        });
    });

});


// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log("Store Rating Server Started");
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("=================================");

});