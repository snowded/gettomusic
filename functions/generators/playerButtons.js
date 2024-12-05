/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = (client, player, number = 5) => {
  const isPaused = player.shoukaku.paused;
  const state = isPaused ? `<:gettoplay:1308759674614452326>` : `<:gettopause:1308761357906083860>`;
  const autoplay = player.data.get("autoplay") ? "success" : "success";

  const row = new ActionRowBuilder();
  const btn = [
    new client.button()[`success`](`${player.guildId}stop`, ` `, `<:gettostop:1277360986025627658>`),
    new client.button()[`success`](`${player.guildId}previous`, ` `, `<:gettoprev:1308759735482323044>`),
    new client.button()[`success`](`${player.guildId}play_pause`, ` `, state),
    new client.button()[`success`](`${player.guildId}skip`, ` `, `<:gettonext:1308759608424140824>`),
    new client.button()[autoplay](`${player.guildId}autoplay`, ` `, `<:auto:1309789663464132628>`),
  ];

  switch (number) {
    case 5:
      row.addComponents(btn[0], btn[1], btn[2], btn[3], btn[4]);
      break;
    case 4:
      row.addComponents(btn[0], btn[1], btn[2], btn[4]);
      break;
    case 3:
      row.addComponents(btn[1], btn[2], btn[4]);
      break;
  }

  return [row];
};
