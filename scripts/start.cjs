const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const serverFile = path.join(root, "server", "dist", "simple-index.js");

if (!fs.existsSync(serverFile)) {
  console.error("The server is not built yet. From the project root run: npm run build");
  process.exit(1);
}

process.chdir(root);
process.env.NODE_ENV = "production";
require("../server/dist/simple-index.js");
