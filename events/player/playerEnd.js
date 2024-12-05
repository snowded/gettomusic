/* made by snow.ded - getto */

module.exports = {
  name: "playerEnd",
  run: async (client, player) => {
    if (player.data.get("message"))
      player.data
        .get("message")
        ?.delete()
        .catch(() => {});
  },
};
