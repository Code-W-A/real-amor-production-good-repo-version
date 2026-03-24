const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Load environment variables from a .env file when running on hosting panels.
// If ENV_PATH is set (e.g. via cPanel Node.js app), load from that path.
try {
  // eslint-disable-next-line global-require
  require("dotenv").config(
    process.env.ENV_PATH ? { path: process.env.ENV_PATH } : undefined
  );
} catch {
  // dotenv is optional; ignore if not installed
}

const dev = process.env.NODE_ENV !== "production";
// In production we should not force localhost.
// cPanel/Node apps typically bind via PORT and proxy to the public domain.
const hostname = dev ? "localhost" : "0.0.0.0";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port} (dev=${dev})`);
  });
});
