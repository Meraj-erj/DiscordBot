import type { Event } from "../interfaces/Event.js";

const event: Event = {
    name: "clientReady",
    once: true,

    async execute(client) {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`🤖 Logged in as ${client.user.tag}`);
        console.log(`🆔 ID: ${client.user.id}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    },
};

export default event;