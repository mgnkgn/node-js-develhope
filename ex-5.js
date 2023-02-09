const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Connection >>>");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(`
    <html>
      <head>
        <title>My Node.js Server</title>
      </head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
