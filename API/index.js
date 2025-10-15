// --- Dependencies ---
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config(); // ⬅️ Load environment variables from .env

// --- Setup Express ---
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Atlas Connection ---
const CONNECTION_STRING = process.env.MONGODB_URI;
const DATABASENAME = "MathQuest";
let database;

// --- Port ---
const PORT = process.env.PORT || 3000;

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

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();

// --- Routes ---

// GET all documents from MathQuest
app.get("/login", async (req, res) => {
  try {
    const docs = await database.collection("Account").find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error("❌ Error fetching documents:", err);
    res.status(500).send("Error fetching documents");
  }
});

// POST a new Player document
app.post("/login", multer().none(), async (req, res) => {
  try {
    const newDoc = {
      Player: req.body.Player || "Unknown Player"
    };

    await database.collection("Account").insertOne(newDoc);
    res.send("✅ Insert successful 🎉");
  } catch (err) {
    console.error("❌ Error inserting document:", err);
    res.status(500).send("Error inserting document");
  }
});
