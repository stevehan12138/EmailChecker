import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import { doc, setDoc, getDoc, arrayRemove, updateDoc } from '@firebase/firestore'
import { serversCol } from '../useDb'

export const RemoveDomain: Command = {
    name: "removedomain",
    description: "remove a allowed domain.",
    type: "CHAT_INPUT",
    options: [{
        name: "domain",
        description: "the domain(no @) to remove",
        type: "STRING"
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        if(!interaction.memberPermissions?.has("ADMINISTRATOR", true)) {
            await interaction.followUp({ content: "You don't have permission to use this command." });
            return;
        }
        
        const domain = interaction.options.get("domain")?.value as string;
        const serverRef = await doc(serversCol, interaction.guild?.id);
        let server = await getDoc(serverRef);

        if (!server.exists()) {
            await interaction.followUp({ content: "The owner didn't set any domains. Please contact the moderators." });
            return;
        }

        if(!domain.match(/^([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9]{1})?)?(\.[a-zA-Z]{2,4})+$/)) {
            await interaction.followUp({ content: "Wrong domain format, please enter the domain only(without @)" });
            return;
        }

        await updateDoc(serverRef, {
            domains: arrayRemove(domain)
        });

        server = await getDoc(serverRef);

        const startEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Removed')
            .setDescription(`The current domains are: ${server.data()?.domains}`)
            .setTimestamp()

        await interaction.followUp({
            embeds: [startEmbed]
        });
    }
};

