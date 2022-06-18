import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Command";

export const Help: Command = {
    name: "help",
    description: "Returns a list of commands",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help')
            .setDescription('This bot verifies the email of a discord user. Verified users are given the "verified" role.')
            .addFields(
                { name: '/start {your school email}', value: 'Get a verfication code to be sent to an email address with specific domains', inline: true },
                { name: '/verify {your code}', value: 'Verify the email address with the verification code', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Mod Only Commands', value: 'These commands are for mods only.'},
                { name: '/info {@user}', value: 'Return the email registered with the user.', inline: true },
                { name: '/unverify {@user}', value: 'Unverifies the user and removes the verified role', inline: true },
                { name: '/setdomain {domain}', value: 'Set the allowed domain to verify. For example, /setdomain uni.edu will allow all the email address ends with @uni.edu. ', inline: true },
                { name: '/alloweddomains', value: 'Return a list of allowed domains', inline: true },
                { name: '/removedomain {domain}', value: 'Remove a domain from the allowed domains', inline: true },
            )
            .setTimestamp()

        await interaction.followUp({
            embeds: [helpEmbed]
        });
    }
};

