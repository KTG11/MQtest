// ===== IMPORTS =====
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");

// ===== SETUP =====
const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== DATABASE CONNECTION =====
const CONNECTION_STRING = "mongodb+srv://ktgsrilanka:Sphere Cylinder@cluster11.vrqoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster11";
const DATABASENAME = "Cluster11";
let database;

const PORT = process.env.PORT || 10000;

// Connect to MongoDB and start server
MongoClient.connect(CONNECTION_STRING)
    .then(client => {
        database = client.db(DATABASENAME);
        console.log("✅ MongoDB connection successful");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    });

// ===== ROUTES =====

// 🔹 Signup - create new user
app.post("/signup", upload.none(), async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).send("Missing required fields");
        }

        const users = database.collection("MathQuest");

        // Check if user already exists
        const existingUser = await users.findOne({ Email: email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Count total users to set numeric _id
        const numOfDocs = await users.countDocuments();

        // Insert new user
        await users.insertOne({
            _id: (numOfDocs + 1).toString(),
            Email: email,
            Username: username,
            password: password,
        });

        res.send("✅ Signup successful");
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Server error during signup");
    }
});

// 🔹 Login - check existing user credentials
app.post("/login", upload.none(), async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Missing email or password");
        }

        const user = await database.collection("MathQuest").findOne({
            Email: email,
            password: password,
        });

        if (!user) {
            return res.status(401).send("Invalid credentials");
        }

        res.send(`✅ Welcome back, ${user.Username}!`);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server error during login");
    }
});

// Optional: test route
app.get("/", (req, res) => {
    res.send("Server is running successfully ✅");
});
