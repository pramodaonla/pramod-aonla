const http = require("http");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });

    try {
      const client = new MongoClient(MONGO_URI);
      await client.connect();
      await client.close();

      res.end(JSON.stringify({
        server: "Running",
        mongo: "MongoDB Connected ✅"
      }));
    } catch (err) {
      res.end(JSON.stringify({
        server: "Running",
        mongo: "MongoDB Error ❌",
        error: err.message
      }));
    }
  }
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
