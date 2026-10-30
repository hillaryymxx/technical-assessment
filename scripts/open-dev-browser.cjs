const http = require("node:http");
const { exec } = require("node:child_process");

const port = process.env.PORT || "3000";
const openUrl = process.env.DEV_OPEN_URL || `http://localhost:${port}`;
const probeUrl = `http://127.0.0.1:${port}`;

const maxAttempts = 120;
let attempts = 0;

function openBrowser() {
  let cmd;
  if (process.platform === "win32") {
    cmd = `start "" "${openUrl}"`;
  } else if (process.platform === "darwin") {
    cmd = `open "${openUrl}"`;
  } else {
    cmd = `xdg-open "${openUrl}"`;
  }

  exec(cmd, (err) => {
    if (err) {
      console.warn("[browser] Could not open automatically:", openUrl);
      process.exit(1);
    }
    console.log("[browser] Opened", openUrl);
    process.exit(0);
  });
}

function waitForServer() {
  const req = http.get(probeUrl, (res) => {
    res.resume();
    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
      openBrowser();
      return;
    }
    retry();
  });

  req.on("error", retry);
  req.setTimeout(2000, () => {
    req.destroy();
    retry();
  });
}

function retry() {
  attempts += 1;
  if (attempts >= maxAttempts) {
    console.warn("[browser] Timed out waiting for dev server at", probeUrl);
    process.exit(1);
  }
  setTimeout(waitForServer, 500);
}

waitForServer();
