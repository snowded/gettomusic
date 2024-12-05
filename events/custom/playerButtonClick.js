/* made by snow.ded - getto */

const updateEmbed = require("@functions/updateEmbed");
const replyToClick = require("@functions/replyToClick");

module.exports = {
  name: "playerButtonClick",
  run: async (client, interaction) => {
    /////////////////////////////////////////////////////////////////////////////
    if (!interaction.member.voice.channel)
      return await replyToClick(
        interaction,
        `${client.emoji.warn} **You must be a voice channel to use this command**`,
      );
    if (
      interaction.guild.members.me.voice.channel &&
      interaction.guild.members.me.voice.channelId !==
        interaction.member.voice.channelId
    )
      return await replyToClick(
        interaction,
        `${client.emoji.warn} **You must be in ${interaction.guild.members.me.voice.channel} to use this command**`,
      );

    /////////////////////////////////////////////////////////////////////////////
    const player = await client.getPlayer(interaction.guildId);
    if (!player?.queue?.current)
      return await replyToClick(
        interaction,
        `${client.emoji.warn} **Nothing is being played right now**`,
      );

    /////////////////////////////////////////////////////////////////////////////

    switch (interaction.customId) {
      case `${interaction.guildId}play_pause`:
        const isPaused = player.shoukaku.paused;

        await player.pause(!isPaused);
        await replyToClick(interaction);
        await updateEmbed(client, player);
        break;

      /////////////////////////////////////////////////////////////////////////////
      case `${interaction.guildId}skip`:
        if (player.queue.length == 0 && !player.data.get("autoplay")) {
          return await replyToClick(
            interaction,
            `${client.emoji.no} **No more songs left in the queue to skip**`,
          );
        }
        await player.skip();
        await replyToClick(interaction);
        break;

      /////////////////////////////////////////////////////////////////////////////
      case `${interaction.guildId}previous`:
        if (!player.queue.previous.length > 0) {
          return await replyToClick(
            interaction,
            `${client.emoji.no} **No Previously played song found**`,
          );
        }
        player.queue.unshift(
          player.queue.previous[player.queue.previous.length - 1],
        );
        await player.skip();

        await replyToClick(interaction);
        break;
      /////////////////////////////////////////////////////////////////////////////

      case `${interaction.guildId}stop`:
        await player.queue.clear();
        await player.data.delete("autoplay");
        player.loop = "none";
        player.playing = false;
        player.paused = false;
        await player.skip();
        await replyToClick(interaction);
        break;
      /////////////////////////////////////////////////////////////////////////////

      case `${interaction.guildId}autoplay`:
        player.data.set("autoplay", !player.data.get("autoplay"));
        player.data.set("requester", client.user);
        await replyToClick(interaction);
        await updateEmbed(client, player);
        break;
      /////////////////////////////////////////////////////////////////////////////

      default:
        await replyToClick(
          interaction,
          `${client.emoji.bell} **Coming soon . . .**`,
        );
        break;
      /////////////////////////////////////////////////////////////////////////////
    }
  },
};
