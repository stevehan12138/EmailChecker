import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import { doc, setDoc, getDoc, arrayUnion, updateDoc } from '@firebase/firestore'
import { serversCol } from '../useDb'

export const AllowedDomains: Command = {
    name: "alloweddomain",
    description: "get a list of allowed domains.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const serverRef = await doc(serversCol, interaction.guild?.id);
        let server = await getDoc(serverRef);

        if (!server.exists()) {
            await interaction.followUp({ content: "The owner didn't set any domains. Please contact the moderators." });
            return;
        }

        const startEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Allowed Domains')
            .setDescription(`The current domains are: ${server.data()?.domains}`)
            .setTimestamp()

        await interaction.followUp({
            embeds: [startEmbed]
        });
    }
};

