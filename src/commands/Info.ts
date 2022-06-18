import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import { doc, setDoc, getDoc, arrayUnion, updateDoc } from '@firebase/firestore'
import { serversCol } from '../useDb'

export const Info: Command = {
    name: "info",
    description: "get info about the a user.",
    type: "CHAT_INPUT",
    options: [{
        name: "user",
        description: "the user to get info about",
        type: "USER"
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        if(!interaction.memberPermissions?.has("ADMINISTRATOR", true)) {
            await interaction.followUp({ content: "You don't have permission to use this command." });
            return;
        }

        const user = interaction.options.getUser("user");
        const serverRef = await doc(serversCol, interaction.guild?.id);
        let server = await getDoc(serverRef);

        if (!user) {
            await interaction.followUp({ content: "Please enter a user." });
            return;
        }

        if (!server.exists()) {
            await interaction.followUp({ content: "The owner didn't set any domains. Please contact the moderators." });
            return;
        }

        const data = server.data()?.users[user.id]

        if (!data) {
            await interaction.followUp({ content: "The user didn't set any email." });
            return;
        }

        const startEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(user.tag)
            .setDescription(`Email: ${data.email}, is verified: ${data.verified}`)
            .setTimestamp()

        await interaction.followUp({
            embeds: [startEmbed]
        });
    }
};

