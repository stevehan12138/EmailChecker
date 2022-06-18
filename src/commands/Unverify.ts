import { BaseCommandInteraction, Client, MessageEmbed, Role } from "discord.js";
import { Command } from "../Command";
import { doc, setDoc, getDoc, arrayUnion, updateDoc } from '@firebase/firestore'
import { serversCol } from '../useDb'

export const Unverify: Command = {
    name: "unverify",
    description: "unverify a user.",
    type: "CHAT_INPUT",
    options: [{
        name: "user",
        description: "the user to get unverify",
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

        if (!data.verified) {
            await interaction.followUp({ content: "The user is not verified" });
            return;
        }

        await updateDoc(serverRef, {
            [`users.${user.id}`] : {
                verified: false,
                email: data.email,
            }
        });

        const role = interaction.guild?.roles.cache.find(r => r.name === "verified") as Role;
        await interaction.guild?.members.cache.get(user.id)?.roles.remove(role);


        const startEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Unverify')
            .setDescription(`${user.tag} is now unverified with email ${data.email}.`)
            .setTimestamp()

        await interaction.followUp({
            embeds: [startEmbed]
        });
    }
};

