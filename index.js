const http = require("http");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

let mongoStatus = "Not connected";

async function connectDB() {
  try {
    if (!MONGO_URI) {
      mongoStatus = "MONGODB_URI not found";
      return;
    }

    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    mongoStatus = "MongoDB Connected ✅";
    console.log(mongoStatus);
  } catch (err) {
    mongoStatus = "MongoDB Error ❌";
    console.error(err.message);
  }
}

// ⚠️ IMPORTANT: build time pe connect nahi
// connectDB(); ❌ removed

const server = http.createServer(async (req, res) => {
  // connect only when request comes
  if (mongoStatus === "Not connected") {
    await connectDB();
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      server: "Running",
      mongo: mongoStatus,
    })
  );
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
