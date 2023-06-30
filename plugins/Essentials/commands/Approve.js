const { Command } = require("../../../structures");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { SuccessEmbed, ErrorEmbed } = require("../../../embeds");

const fs = require("fs");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "approve",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("approve")
        .setDescription("Approve")
        .addUserOption((user) =>
          user.setName("user").setDescription("User").setRequired(true)
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

    let member = interaction.guild.members.cache.get(user.id);

    await member.roles.add(this.client.config.approve_roles);

    try {
      await user.send({
        embeds: [
          new SuccessEmbed({
            description: `Your ID Verification was approved. You have been granted a role.`,
          }),
        ],
      });
    } catch (error) {}

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Approved ${user} (${user.id})!`,
        }),
      ],
    });
    let getMessage = JSON.parse(await fs.readFileSync("./sent_messages.json"));
    const channel = interaction.channel;
    channel.messages.fetch(getMessage[interaction.user.id]?.id).then(message => {
      message.delete()
   });
   delete getMessage[interaction.user.id];

  fs.writeFileSync("./sent_messages.json", JSON.stringify(getMessage, null, 4), 'utf8');
    
  }
};
