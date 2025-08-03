import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/tours") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        if (!data.date || !Array.isArray(data.orders)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid payload" }));
          return;
        }
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Tour created" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

