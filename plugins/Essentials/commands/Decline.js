const { Command } = require("../../../structures");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { SuccessEmbed, ErrorEmbed } = require("../../../embeds");

const fs = require("fs");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "decline",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("decline")
        .setDescription("Decline")
        .addUserOption((user) =>
          user.setName("user").setDescription("User").setRequired(true)
        )
        .addStringOption((str) =>
          str
            .setName("reason")
            .setDescription("Reason")
            .setRequired(true)
            .setMinLength(16)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let whitelist = JSON.parse(await fs.readFileSync("./whitelist.json"));

    if (!whitelist[interaction.user.id]?.status) {
      return await interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description: "Only whitelisted people can do this.",
          }),
        ],
      });
    }

    let user = interaction.options.getUser("user", true);
    let reason = interaction.options.getString("reason", true);

    try {
      await user.send({
        embeds: [
          new ErrorEmbed({
            description: `Your ID Verification was declined by for \`${reason}\``,
          }),
        ],
      });
    } catch (error) {}

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Declined ${user} (${user.id}) for \`${reason}\`.`,
        }),
      ],
    });
  }
};
