import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const report: string[] = [];

function line(text = ""): void {
    console.log(text);
    report.push(text);
}

function title(text: string): void {
    const bar = "=".repeat(70);

    line();
    line(bar);
    line(text);
    line(bar);
}

function ok(text: string): void {
    line(`✅ ${text}`);
}

function warn(text: string): void {
    line(`⚠️ ${text}`);
}

function fail(text: string): void {
    line(`❌ ${text}`);
}

function exists(file: string): boolean {
    return fs.existsSync(path.join(process.cwd(), file));
}

title("Discord Bot Diagnostic");

line(`Date : ${new Date().toLocaleString()}`);
line(`OS   : ${os.type()} ${os.release()}`);
line(`CPU  : ${os.cpus()[0]?.model ?? "Unknown"}`);
line(`RAM  : ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
line(`Node : ${process.version}`);

try {
    const npmVersion = execSync("npm -v").toString().trim();
    line(`NPM  : ${npmVersion}`);
} catch {
    warn("Unable to detect npm version.");
}

title("Project");

const requiredFiles = [
    ".env",
    "package.json",
    "tsconfig.json",
    "src",
    "src/index.ts",
    "src/commands",
    "src/events",
    "src/handlers",
    "src/interfaces",
];

for (const file of requiredFiles) {
    if (exists(file)) {
        ok(file);
    } else {
        fail(file);
    }
}

title("Environment");

if (process.env.DISCORD_TOKEN) {
    ok("DISCORD_TOKEN");
} else {
    fail("DISCORD_TOKEN");
}

if (process.env.CLIENT_ID) {
    ok("CLIENT_ID");
} else {
    fail("CLIENT_ID");
}

if (process.env.GUILD_ID) {
    ok("GUILD_ID");
} else {
    fail("GUILD_ID");
}

title("Git");

try {
    line(execSync("git branch --show-current").toString().trim());
} catch {
    warn("Git not found.");
}

try {
    line(execSync("git log --oneline -1").toString().trim());
} catch {
    warn("Unable to read Git history.");
}

title("Build");

try {
    execSync("npm run build", {
        stdio: "pipe",
    });

    ok("Build Success");
} catch (error: unknown) {
    fail("Build Failed");

    if (error instanceof Error) {
        line(error.message);
    }
}

title("Discord Login");

if (process.env.DISCORD_TOKEN) {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });

    try {
        const start = Date.now();

        await client.login(process.env.DISCORD_TOKEN);

        await new Promise<void>((resolve) => {
            client.once("clientReady", () => resolve());
        });

        ok(`Logged in : ${client.user?.tag}`);
        line(`ID         : ${client.user?.id}`);
        line(`Guilds     : ${client.guilds.cache.size}`);
        line(`Ping       : ${client.ws.ping} ms`);
        line(`Login Time : ${Date.now() - start} ms`);

        client.destroy();
    } catch (error: unknown) {
        fail("Login Failed");

        if (error instanceof Error) {
            line(error.message);
        } else {
            line(String(error));
        }
    }
}

title("Folders");

function walk(dir: string, depth = 0): void {
    if (!fs.existsSync(dir)) {
        return;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);

        line(`${" ".repeat(depth * 2)}- ${file}`);

        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath, depth + 1);
        }
    }
}

walk("src");

title("Memory");

const memory = process.memoryUsage();

line(`RSS        : ${(memory.rss / 1024 / 1024).toFixed(2)} MB`);
line(`Heap Used  : ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
line(`Heap Total : ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`);

title("Finish");

fs.writeFileSync("debug-report.txt", report.join("\n"));

ok("Report saved to debug-report.txt");