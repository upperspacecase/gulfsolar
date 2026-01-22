import { promises as fs } from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "data", "calculator-settings.json");

async function readSettings() {
  try {
    const raw = await fs.readFile(settingsPath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

async function writeSettings(payload) {
  const data = JSON.stringify(payload, null, 2);
  await fs.mkdir(path.dirname(settingsPath), { recursive: true });
  await fs.writeFile(settingsPath, data);
}

function isAuthorized(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.replace("Bearer ", "").trim();
  return token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await readSettings();
  if (!settings) {
    return Response.json({ error: "Settings not found" }, { status: 404 });
  }

  return Response.json({ settings });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  await writeSettings(body);
  return Response.json({ ok: true });
}
