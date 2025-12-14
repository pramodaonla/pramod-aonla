const http = require("http");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 10000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

async function startServer() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Backend is running" }));
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
