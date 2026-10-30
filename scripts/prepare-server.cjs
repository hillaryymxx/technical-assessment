const fs = require("fs");
const path = require("path");

const entry = path.join(__dirname, "..", "server", "src", "simple-index.ts");

if (!fs.existsSync(entry)) {
  console.error("The server is missing. npm install must be run from the project root.");
  process.exit(1);
}

console.log("Server packages are installed with the site.");
console.log("Run: npm run dev");
