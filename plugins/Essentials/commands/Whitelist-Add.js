const { Command } = require("../../../structures");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { SuccessEmbed, ErrorEmbed } = require("../../../embeds");

const fs = require("fs");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "whitelist-add",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("whitelist-add")
        .setDescription("Whitelist Add")
        .addUserOption((user) =>
          user.setName("user").setDescription("User").setRequired(true)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!this.client.config.owner_ids.includes(interaction.user.id)) {
      return await interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description: "This command can be only used by OWNER!",
          }),
        ],
      });
    }

    let user = interaction.options.getUser("user", true);

    let whitelist = JSON.parse(await fs.readFileSync("./whitelist.json"));

    whitelist[user.id] = {
      status: true,
    };

    try {
      await fs.writeFileSync(
        "./whitelist.json",
        JSON.stringify(whitelist),
        "utf-8"
      );
    } catch (error) {
      console.error(error);
    }

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Added ${user} (${user.id}) to the whitelist!`,
        }),
      ],
    });
  }
};
