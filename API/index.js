// --- Dependencies ---
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // for .env support locally and Render env vars

// --- Setup Express ---
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Atlas Connection ---
// Use environment variable on Render (set under Environment → Add Variable)
const CONNECTION_STRING = process.env.MONGODB_URI;
if (!CONNECTION_STRING) {
  console.error("❌ MongoDB connection string missing! Add MONGODB_URI in Render environment variables.");
  process.exit(1);
}

const DATABASENAME = "MathQuest";
let database;

// --- Port ---
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.send("✅ MathQuest API is live and running on Render!");
});

// --- Connect to MongoDB and Start Server ---
async function startServer() {
  try {
    const client = new MongoClient(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    database = client.db(DATABASENAME);
    console.log("✅ Connected to MongoDB Atlas");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();

// --- Routes ---

// GET all accounts
app.get("/login", async (req, res) => {
  try {
    const usersCollection = database.collection("Account");
    const docs = await usersCollection.find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error("❌ Error fetching documents:", err);
    res.status(500).send("Error fetching documents");
  }
});

// POST login
app.post("/login", async (req, res) => {
  try {
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const usersCollection = database.collection("Account");
    const user = await usersCollection.findOne({ UserName });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        UserName: user.UserName,
        Email: user.Email,
      },
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// POST register
app.post("/register", multer().none(), async (req, res) => {
  try {
    const { UserName, Password, Email } = req.body;

    // 1️⃣ Validate input
    if (!UserName || !Password || !Email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const usersCollection = database.collection("Account");

    // 2️⃣ Check if username or email already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ Email }, { UserName }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "❌ Username or Email already exists" });
    }

    // 3️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // 4️⃣ Create and insert user
    await usersCollection.insertOne({
      UserName,
      Email,
      Password: hashedPassword,
    });

    res.status(201).json({ message: "✅ Registration successful 🎉" });
  } catch (err) {
    console.error("❌ Error inserting document:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
