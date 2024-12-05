/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "reportSubmit",
  run: async (client, interaction) => {
    const [command, issue, comments] = [
      interaction.fields.getTextInputValue("command"),
      interaction.fields.getTextInputValue("issue"),
      interaction.fields.getTextInputValue("comments"),
    ];

    await interaction.deferUpdate();

    const row = new ActionRowBuilder().addComponents(
      new client.button()
        .link("Join support server for more info", client.support)
        .setEmoji(client.emoji.helpline),
    );
    await interaction.message
      .edit({
        embeds: [
          new client.embed().desc(
            `${client.emoji.yes} **Successfully reported your issue**`,
          ),
        ],
        components: [row],
      })
      .catch(() => {});

    await client.webhooks.error
      .send({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [
          new client.embed()
            .title(`Issue reported for : ${command}`)
            .desc(
              `**User :** ${interaction.member} [${interaction.member.id}]\n` +
                `**Guild :** ${interaction.guild} [${interaction.guild.id}]\n\n` +
                `**Issue :** \`\`\`\n${issue}\`\`\`\n` +
                `**Comments :** \`\`\`\n${
                  comments || `No additional comments`
                }\`\`\`\n`,
            )
            .setColor("#ff6200"),
        ],
      })
      .catch(() => {});
  },
};
