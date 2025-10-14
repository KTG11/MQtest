// --- Dependencies ---
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");

// --- Setup Express ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Cloud MongoDB Connection String ---
const CONNECTION_STRING = "mongodb+srv://ktgsrilanka:Sphere Cylinder@cluster11.vrqoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster11";
// 👆 keep this as your Atlas connection string
// ⚠️ if your password or username has spaces/special chars, make sure they are URL-encoded (I can help with that if needed)

const DATABASENAME = "Cluster11";
let database;

// --- Local Port ---
const PORT = 3000;

// --- Connect to MongoDB Atlas and start the server ---
async function startServer() {
  try {
    const client = new MongoClient(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    database = client.db(DATABASENAME);
    console.log("✅ Connected to MongoDB Atlas (cloud)");
    app.listen(PORT, () => console.log(`🚀 Server running locally on http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();

// --- Routes ---

// GET all documents
app.get("/login", async (req, res) => {
  try {
    const docs = await database.collection("MathQuest").find({}).toArray();
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching documents");
  }
});

// POST a new document
app.post("/login", multer().none(), async (req, res) => {
  try {
    const newDoc = {
      description: req.body.newNotes || "No description provided",
      createdAt: new Date()
    };
    await database.collection("MathQuest").insertOne(newDoc);
    res.send("Insert successful 🎉");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting document");
  }
});
