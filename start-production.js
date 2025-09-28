#!/usr/bin/env node

/**
 * Handles server initialization for IPL Auction Dashboard
 * This app fetches data directly from Google Sheets - no backend database or API keys required
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("✅ IPL Auction Dashboard - Production startup");
console.log("📊 This app fetches data directly from Google Sheets");
console.log("🚀 Starting production server...");

// Set production environment
process.env.NODE_ENV = "production";

// Start the production server with production environment
const serverPath = path.join(__dirname, "dist", "index.js");
const server = spawn("node", [serverPath], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
  },
});

// Handle server process events
server.on("error", (error) => {
  console.error("❌ Failed to start server:", error.message);
  process.exit(1);
});

server.on("exit", (code, signal) => {
  if (signal) {
    console.log(`🛑 Server terminated by signal: ${signal}`);
  } else if (code !== 0) {
    console.error(`❌ Server exited with code: ${code}`);
    process.exit(code);
  } else {
    console.log("✅ Server shut down gracefully");
  }
});

// Handle process termination
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...");
  server.kill("SIGTERM");
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully...");
  server.kill("SIGINT");
});