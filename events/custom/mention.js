/* made by snow.ded - getto */

module.exports = {
  name: "mention",
  run: async (client, message) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Reply when bot is mentioned ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    const embed = new client.embed()
      .setAuthor({
        name: `Hey There! Prefix for this server : ${client.prefix}`,
        iconURL: message.author.displayAvatarURL()
      })
      
      //.setImage("https://github.com/snowded/Getto.DiscordBot/blob/main/GettoBanner.png?raw=true")
      //.setTimestamp();
    await message.reply({ embeds: [embed] }).catch(() => {});
  },
};
