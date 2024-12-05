/* made by snow.ded - getto */

const Nodeactyl = require("nodeactyl");

module.exports = {
  name: "panel",
  aliases: ["vps"],
  cooldown: "",
  category: "owner",
  usage: "",
  description: "Shows nodeactyl stats",
  args: false,
  vote: false,
  new: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    let emb = new client.embed().desc(
      `${emoji.cool} **| Getting data. Please wait. . .**`,
    );
    let reply = await message.reply({ embeds: [emb] }).catch(() => {});
    const credentials = [
      {
        uri: "https://panel.moonhost.xyz",
        key: "ptlc_h2lSpYWavHC72KMKpFEe1c7kToc7G50zvcJl9eWB9Sn",
        id: "cbbba353-e5fb-4eda-9c9f-3a84b6215679",
      },
    ];
    descriptions = async () => {
      let data = [];

      for (let i = 0; i < credentials.length; i++) {
        const entry = credentials[i];
        try {
          let panel = new Nodeactyl.NodeactylClient(entry.uri, entry.key);
          let id = entry.id;

          let usages = await panel.getServerUsages(id);
          let details = await panel.getServerDetails(id);

          await data.push(
            `\`\`\`js\n` +
              `"Node/Pterod-actyl Panel Stats" \n\n` +
              `[\n` +
              `  ${details.name} { \n` +
              `    Node : '${details.node}',\n` +
              `    Uptime : '${require("ms")(usages.resources.uptime)}',\n` +
              `    Docker : '${details.docker_image.split(":")[1]}',\n` +
              `    State : '${usages.current_state}',\n` +
              `    CPU: ${usages.resources.cpu_absolute}/${details.limits.cpu} %vCPU,\n` +
              `    RAM: ${(usages.resources.memory_bytes / 1048576).toFixed(
                3,
              )}/${details.limits.memory} MiB,\n` +
              `    Disk: ${(usages.resources.disk_bytes / 1048576).toFixed(
                3,
              )}/${details.limits.disk} MiB,\n` +
              `    Network_Tx: ${(
                usages.resources.network_tx_bytes / 1048576
              ).toFixed(3)} MiB,\n` +
              `    Network_Rx: ${(
                usages.resources.network_rx_bytes / 1048576
              ).toFixed(3)} MiB,\n` +
              `  },\n` +
              `]\`\`\``,
          );
        } catch (e) {
          if (e) data.push(`\`\`\`js\n${entry.uri}\n\n${e}\`\`\``);
        }
      }
      return data;
    };

    const descs = await descriptions();
    const pages = await descs.map((desc) => new client.embed().desc(desc));
    await require("@utils/paginate.js")(client, message, pages);
    return reply.delete().catch(() => {});
  },
};
