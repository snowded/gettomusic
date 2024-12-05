/* made by snow.ded - getto */

module.exports = async (client) => {
  if (![...client.manager.shoukaku.nodes][0][1].state == "1")
    return client.log(
      `Lavalink node not ready! Loading 24*7 player/(s) once node is ready`,
      "warn",
    );

  client.loading247 = true;
  let i = 0;
  let keys = await client.db.twoFourSeven.keys;
  keys = keys.filter((key) => key.includes(client.user.id));

  for (let key of keys) {
    let guild = key.split("_")[1];
    let { TextId, VoiceId } = await client.db.twoFourSeven.get(key);
    let [text, voice] = [
      client.channels.cache.get(TextId) || null,
      client.channels.cache.get(VoiceId) || null,
    ];

    if (!voice) {
      await text
        ?.send({
          embeds: [
            new client.embed()
              .title(`247 player error`)
              .desc(
                `${client.emoji.warn} **Unable to find 247 voice channel**\n` +
                  `${client.emoji.bell} *Use \`${client.prefix}move\` to set a new 247 channel*`,
              ),
          ],
        })
        .catch(() => {});
      continue;
    }

    if (!text) {
      await voice
        ?.send({
          embeds: [
            new client.embed()
              .title(`247 player error`)
              .desc(
                `${client.emoji.warn} **Unable to find 247 text channel**\n` +
                  `${client.emoji.bell} *This will now be used as default 247 channel*\n` +
                  `${client.emoji.bell} *Use \`${client.prefix}move\` to set a new 247 channel*`,
              ),
          ],
        })
        .catch(() => {});
      text = voice;

      await client.db.twoFourSeven.set(key, {
        TextId: text.id,
        VoiceId: voice.id,
      });
    }

    if (await client.getPlayer(guild)) continue;
    try {
      await client.manager.createPlayer({
        voiceId: voice.id,
        textId: text.id,
        guildId: guild,
        shardId: voice.guild.shardId,
        loadBalancer: true,
        deaf: true,
      });
    } catch (e) {}
    await text
      .send({
        embeds: [
          new client.embed()
            .title(`247 player re-/created`)
            .desc(
              `${client.emoji.bell} **Joined <#${voice.id}> and bound to <#${text.id}>**`,
            ),
        ],
      })
      .then(async (m) =>
        setTimeout(async () => await m.delete().catch(() => {}), 5000),
      )
      .catch(() => {});

    i++;
  }

  client.log(`Loaded ${i} 247 player/(s)`, `player`);
};
