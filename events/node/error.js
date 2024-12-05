/* made by snow.ded - getto */

module.exports = {
  name: "error",
  run: async (client, name, error) => {
    client.log(`Lavalink "${name}" error ${error}`, "error");
  },
};
