import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const files = fs.readdirSync(__dirname);

  for (const file of files) {
    if (file === "index.js" || !file.endsWith("Route.js")) continue;

    const routeName = file.slice(0, -8).toLowerCase();
    const routeModule = await import(`./${file}`);
    router.use(`/${routeName}`, routeModule.default);
  }
} catch (err) {
  console.error("Error loading routes:", err);
}

export default router;
