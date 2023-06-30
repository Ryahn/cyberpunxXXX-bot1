const { Command } = require("../../../structures");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { DefaultEmbed, ErrorEmbed, SuccessEmbed } = require("../../../embeds");
const fs = require('fs');

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "verify",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Verify"),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let msg;

    try {
      msg = await interaction.user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("👤 ID Verification")
            .setDescription(
              "Please, send your ID/Passport below this message, so we can confirm that you are **18+**. \n\nImage must be clear, not cropped, and birthday date must be visible. \n\nAfter we confirm your ID, we will not keep your information. \n\nIf you want to send us a comment, just send it with attachment together. \n\n⬇ **SEND YOUR ID BELOW** ⬇"
            )
            .setThumbnail(
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/640px-Twitter_Verified_Badge.svg.png"
            )
            .setColor(0x2f3136),
        ],
      });
    } catch (error) {
      return interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description:
              "Please, unlock your DMs so I can send you a private message.",
          }),
        ],
      });
    }

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Check your DMs! You must reply within 5 minutes.`,
        }),
      ],
    });

    let filter = (m) => m.attachments.size > 0;

    let collected = await msg.channel.awaitMessages({
      filter,
      max: 1,
      time: 300_000,
    });

    if (collected) {
      await msg.channel
        .send({
          embeds: [
            new SuccessEmbed({
              description: `Successfully sent your ID for approval request.`,
            }),
          ],
        })
        .catch(() => {});
    }

    try {
      const message = await interaction.guild.channels.cache
        .get(this.client.config.application_logs)
        ?.send({
          embeds: [
            new DefaultEmbed()
              .setTitle("👤 ID Verification | Request")
              .addFields(
                { name: "User", value: `${interaction.user}`, inline: true },
                { name: "ID", value: `${interaction.user.id}`, inline: true },
                {
                  name: "Comment",
                  value: `${collected.first().content || "/"}`,
                  inline: true,
                },
                {
                  name: "Commands",
                  value: `\`/approve user: @${interaction.user.tag}\` \n\`/decline user: @${interaction.user.tag} reason: Your reason\``,
                }
              )
              .setImage(collected.first().attachments.first().url),
          ],
        });
        let saveMessage = JSON.parse(await fs.readFileSync("./sent_messages.json"));
        
        saveMessage[interaction.user.id]  = {
          id: message.id,
        };
        try {
          await fs.writeFileSync(
            "./sent_messages.json",
            JSON.stringify(saveMessage),
            "utf-8"
          );
        } catch (error) {
          console.error(error);
        }
        console.log(`User: ${interaction.user.id} Message: ${message.id}`)
    } catch (error) {
      console.error(error);
    }
  }
};
