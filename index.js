const http = require("http");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

let dbStatus = "Connecting to MongoDB...";

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    dbStatus = "MongoDB Connected Successfully ✅";
    console.log(dbStatus);
  } catch (error) {
    dbStatus = "MongoDB Connection Failed ❌";
    console.error(error.message);
  }
}

connectDB();

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      server: "Running",
      database: dbStatus
    })
  );
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
