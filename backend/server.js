const app = require("./app");
const mongoose = require("mongoose");

// Ensure environment variables are set
const PORT = process.env.PORT || 10000; // Render gives a dynamic port
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set in environment variables");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("✅ Connected to MongoDB");

    // Start the server
    const server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

    // Render stability tweaks (optional but recommended)
    server.keepAliveTimeout = 120000;   // 120s
    server.headersTimeout = 120000;     // 120s
})
.catch(err => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});
