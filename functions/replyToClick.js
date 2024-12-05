/* made by snow.ded - getto */

module.exports = replyToClick = async (int, args, ephemeral = true) => {
  args
    ? await int
        .reply({
          embeds: [new int.client.embed().desc(`${args}`)],
          ephemeral: ephemeral,
        })
        .catch((err) => {
          int.deferUpdate();
        })
    : await int.deferUpdate();
};
