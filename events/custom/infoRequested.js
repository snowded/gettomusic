/* made by snow.ded - getto */

module.exports = {
  name: "infoRequested",
  run: async (client, message, command) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Reply with info about cmd requested ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    return message.reply({
      embeds: [
        new client.embed()
          .desc(
            `${client.emoji.free} **Aliases :** ${
              command.aliases?.[0]
                ? `${command.aliases.join(", ")}`
                : "No aliases"
            }\n` +
              `${client.emoji.message} **Usage : [${client.prefix}${command.name} ${command.usage}](${client.support})**\n` +
              `${client.emoji.bell} **Description :** ${
                command.description || `No description available`
              }\n\n` +
              `\`\`\`js\n` +
              `<> = required | [] = optional` +
              `\n\`\`\``,
          )
          .title(
            `Command info - ${
              command.name.charAt(0).toUpperCase() + command.name.slice(1)
            }`,
          ),
      ],
    });
  },
};
