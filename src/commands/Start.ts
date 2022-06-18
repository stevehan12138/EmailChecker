import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import { v4 as uuid } from "uuid";
import { doc, getDoc, updateDoc } from '@firebase/firestore'
import { serversCol } from '../useDb'
import nodemailer from "nodemailer";

import * as dotenv from 'dotenv';
import path from 'path';
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const Start: Command = {
    name: "start",
    description: "Get a verification code to be sent to an email address with specific domains",
    type: "CHAT_INPUT",
    options: [{
        name: "email",
        description: "your school email",
        type: "STRING"
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {

        const email = interaction.options.get("email")?.value as string;
        const serverRef = await doc(serversCol, interaction.guild?.id);
        const server = await getDoc(serverRef);

        if (!server.exists()) {
            await interaction.followUp({ content: "The owner didn't set any domains. Please contact the moderators." });
            return;
        }
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            await interaction.followUp({ content: "No email specified or wrong format" });
            return;
        }
        if (!server.data()?.domains.includes(email.split("@")[1])) {
            await interaction.followUp({ content: `The email is not from an allowed domain: ${server.data()?.domains}` });
            return;
        }

        const data = server.data()?.users[interaction.user.id]

        if (data && data.verified) {
            await interaction.followUp({ content: "You have already verified your account." });
            return;
        }

        const code = uuid();

        await updateDoc(serverRef, {
            [`users.${interaction.user.id}`] : {
                code: code,
                email: email,
                verified: false
            }
        });

        //TODO: add more methods of emailing
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            },
        } as SMTPTransport.Options);
        
        let info = await transporter.sendMail({
            from: '"CheckEmail" <service@mail.ilikechicken.me>',
            to: email,
            subject: `Verification code for ${interaction.guild?.name}`,
            text: `Your verification code is: ${code}`,
        });

        if (info.rejected.length > 0) {
            await interaction.followUp({ content: "Unable to send the verification code. Please contact the moderators." });
            return;
        }
        const startEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Sent')
            .setDescription(`Verification code sent to ${email}. Check your spam!`)
            .setTimestamp()

        await interaction.followUp({
            embeds: [startEmbed]
        });
    }
};

