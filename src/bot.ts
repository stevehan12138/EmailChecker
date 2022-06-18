import { Client, Intents } from "discord.js";
import * as dotenv from 'dotenv';
import path from 'path';

import interactionCreate from "./listeners/interactionCreate";
import { Commands } from "./Commands";

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const TOKEN = process.env.DISCORD_TOKEN;

if(!TOKEN) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', async () => {
    if (!client.user || !client.application) {
        return;
    }

    await client.application.commands.set(Commands);
    client.user?.setActivity('/help');

    console.log(`Logged in as ${client.user.username}`);
});

client.on('guildCreate', guild => {
    console.log(`Joined guild ${guild.name}`);
});

interactionCreate(client);

client.login(TOKEN);