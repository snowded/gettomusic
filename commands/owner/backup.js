/* made by snow.ded - getto */

module.exports = {
  name: "backup",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "",
  description: "sends backup zip to DM",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    const moment = require("moment");
    const date = moment().format("DD-MM-YYYY_hh-mm-ss");

    const backup_zip_manager = async (msg) => {
      const file = `./emerald-${args[0] ? `${args[0]}-` : ``}${date}.zip`;

      const { AttachmentBuilder } = require("discord.js");

      let m = await msg
        .reply({
          embeds: [
            new client.embed().desc(
              `**${emoji.cool} | Preparing zip please wait. . .**`,
            ),
          ],
        })
        .catch(() => {});

      await require("@functions/archiver.js")(file);

      await msg.author
        .send({
          files: [
            new AttachmentBuilder(file, {
              name: file,
            }),
          ],
        })
        .then(async () => {
          await m
            .edit({
              embeds: [
                new client.embed().desc(
                  `**${emoji.yes} | Successfully sent zip to DM**`,
                ),
              ],
            })
            .catch(() => {});
        })
        .catch(async (err) => {
          await m
            .edit({
              embeds: [
                new client.embed().desc(
                  `**${emoji.no} | Could not send zip to DM**\n${err}`,
                ),
              ],
            })
            .catch(() => {});
        });
      const fs = require("fs");
      await fs.unlink(file, () => {
        return;
      });
    };

    await backup_zip_manager(message);
  },
};
