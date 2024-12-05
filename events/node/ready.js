/* made by snow.ded - getto */

module.exports = {
  name: "ready",
  run: async (client, name) => {
    client.log(`Lavalink "${name}" connection established`, "lavalink");
    client.loading247
      ? null
      : await require("@functions/load247players.js")(client);    
      
      client.on('messageCreate', async (message) => {
        if (message.content.trim() === '<@1092374628556615690>') {
          try {
            await message.react('1310152524182851606');
          } catch (error) {
            console.error('Failed to react to mention:', error);
          }
        }
      });
  },

};
