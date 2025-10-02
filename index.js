var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://ktgsrilanka:Sphere Cylinder@cluster11.vrqoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster11";
var DATABASENAME = "Cluster11";
var database;

// Render requires dynamic port
const PORT = process.env.PORT || 10000;

// Start server
app.listen(PORT, "0.0.0.0", () => {
    MongoClient.connect(CONNECTION_STRING, (error, client) => {
        if (error) {
            console.error("❌ MongoDB connection failed:", error);
            process.exit(1);
        }
        database = client.db(DATABASENAME);
        console.log("✅ MongoDB connection Successful");
        console.log(`🚀 Server running on port ${PORT}`);
    });
});

// GET /login → return all MathQuest docs
app.get("/login", (request, response) => {
    database.collection("MathQuest").find({}).toArray((error, documents) => {
        if (error) {
            response.status(500).send("Error fetching documents");
        } else {
            response.send(documents); // fixed: was 'result'
        }
    });
});

// POST /login → insert a new MathQuest record
app.post("/login", multer().none(), (request, response) => {
    database.collection("MathQuest").countDocuments({}, function (error, numOfDocs) {
        if (error) {
            response.status(500).send("Error counting documents");
        } else {
            database.collection("MathQuest").insertOne({
                _id: (numOfDocs + 1).toString(),
                description: request.body.newNotes
            }, (err, result) => {
                if (err) {
                    response.status(500).send("Error inserting document");
                } else {
                    response.send("✅ Insert successful");
                }
            });
        }
    });
});
