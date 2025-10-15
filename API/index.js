// --- Dependencies ---
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
//require("dotenv").config();

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
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;

// --- Routes ---
// (These expect `database` to be initialized)
app.get("/login", async (req, res) => {
  try {
    const docs = await database.collection("Account").find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error("❌ Error fetching documents:", err);
    res.status(500).send("Error fetching documents");
  }
});

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

// --- Connect to MongoDB and Start Server ---
async function startServer() {
  try {
    const client = new MongoClient(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    database = client.db(DATABASENAME);
    console.log("✅ MongoDB connection successful");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();
