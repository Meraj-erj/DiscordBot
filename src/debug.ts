import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import process from "node:process";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const report: string[] = [];

function line(text = "") {
    console.log(text);
    report.push(text);
}

function title(text: string) {
    const bar = "=".repeat(70);
    line("");
    line(bar);
    line(text);
    line(bar);
}

function ok(text: string) {
    line(`✅ ${text}`);
}

function warn(text: string) {
    line(`⚠️ ${text}`);
}

function fail(text: string) {
    line(`❌ ${text}`);
}

function exists(file: string) {
    return fs.existsSync(path.join(process.cwd(), file));
}

title("Discord Bot Diagnostic");

line(`Date : ${new Date().toLocaleString()}`);
line(`OS   : ${os.type()} ${os.release()}`);
line(`CPU  : ${os.cpus()[0].model}`);
line(`RAM  : ${(os.totalmem()/1024/1024/1024).toFixed(2)} GB`);
line(`Node : ${process.version}`);

try{
    line(`NPM  : ${execSync("npm -v").toString().trim()}`);
}catch{}

title("Project");

[
".env",
"package.json",
"tsconfig.json",
"src",
"src/index.ts",
"src/commands",
"src/events",
"src/handlers",
"src/interfaces"
].forEach(file=>{
    exists(file) ? ok(file) : fail(file);
});

title("Environment");

process.env.DISCORD_TOKEN ? ok("DISCORD_TOKEN") : fail("DISCORD_TOKEN");
process.env.CLIENT_ID ? ok("CLIENT_ID") : fail("CLIENT_ID");
process.env.GUILD_ID ? ok("GUILD_ID") : fail("GUILD_ID");

title("Git");

try{
    line(execSync("git branch --show-current").toString().trim());
}catch{
    warn("Git not found");
}

try{
    line(execSync("git log --oneline -1").toString().trim());
}catch{}

title("Build");

try{
    execSync("npm run build",{stdio:"pipe"});
    ok("Build Success");
}catch(e:any){
    fail("Build Failed");
    line(e.stdout?.toString()||"");
    line(e.stderr?.toString()||"");
}

title("Discord Login");

if(process.env.DISCORD_TOKEN){

    const client=new Client({
        intents:[GatewayIntentBits.Guilds]
    });

    try{

        const start=Date.now();

        await client.login(process.env.DISCORD_TOKEN);

        await new Promise(resolve=>client.once("clientReady",resolve));

        ok(`Logged in : ${client.user?.tag}`);
        line(`ID     : ${client.user?.id}`);
        line(`Guilds : ${client.guilds.cache.size}`);
        line(`Ping   : ${client.ws.ping} ms`);
        line(`Login Time : ${Date.now()-start} ms`);

        await client.destroy();

    }catch(err:any){
        fail("Login Failed");
        line(String(err));
    }

}

title("Folders");

function walk(dir:string,depth=0){

    if(!fs.existsSync(dir)) return;

    const files=fs.readdirSync(dir);

    for(const file of files){

        const full=path.join(dir,file);

        line(`${" ".repeat(depth*2)}- ${file}`);

        if(fs.statSync(full).isDirectory()){
            walk(full,depth+1);
        }

    }

}

walk("src");

title("Memory");

const mem=process.memoryUsage();

line(`RSS : ${(mem.rss/1024/1024).toFixed(2)} MB`);
line(`Heap Used : ${(mem.heapUsed/1024/1024).toFixed(2)} MB`);
line(`Heap Total: ${(mem.heapTotal/1024/1024).toFixed(2)} MB`);

title("Finish");

fs.writeFileSync("debug-report.txt",report.join("\n"));

ok("Report saved to debug-report.txt");