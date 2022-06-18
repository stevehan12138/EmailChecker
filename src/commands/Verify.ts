import { BaseCommandInteraction, Client, MessageEmbed, Role } from "discord.js";
import { Command } from "../Command";
import { doc, setDoc, getDoc, arrayUnion, updateDoc } from '@firebase/firestore'
import { serversCol } from '../useDb'

export const Verify: Command = {
    name: "verify",
    description: "verify your email with the verification code",
    type: "CHAT_INPUT",
    options: [{
        name: "code",
        description: "your verification code.",
        type: "STRING"
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const code = interaction.options.get("code")?.value as string;
        const serverRef = await doc(serversCol, interaction.guild?.id);
        let server = await getDoc(serverRef);

        if (!code) {
            await interaction.followUp({ content: "Please enter your verification code." });
            return;
        }

        if (!server.exists()) {
            await interaction.followUp({ content: "The owner didn't set any domains. Please contact the moderators." });
            return;
        }

        const data = server.data()?.users[interaction.user.id]

        if (!data) {
            await interaction.followUp({ content: "You didn't set any email." });
            return;
        }

        if (data.verified) {
            await interaction.followUp({ content: "You are already verified." });
            return;
        }

        if (!data.code) {
            await interaction.followUp({ content: "You don't have a pending verification code." });
            return;
        }

        const startEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Verify')
            .setTimestamp()
        if (data.code === code) {
            startEmbed.setDescription(`You have verified your account with email ${data.email}.`)
            await updateDoc(serverRef, {
                [`users.${interaction.user.id}`] : {
                    email: data.email,
                    verified: true
                }
            });
            const role = interaction.guild?.roles.cache.find(r => r.name === "verified") as Role;
            await interaction.guild?.members.cache.get(interaction.user.id)?.roles.add(role);
            
        } else {
            startEmbed.setDescription(`The code you entered is incorrect.`)
        }

        await interaction.followUp({
            embeds: [startEmbed]
        });
    }
};

