/* made by snow.ded - getto */

const { AttachmentBuilder } = require("discord.js");

module.exports = async (file, channel, time) => {
  await require("@functions/archiver.js")(file);
  await channel
    .send({
      files: [
        new AttachmentBuilder(file, {
          name: file,
        }),
      ],
    })
    .then(async (msg) => {
      await require("fs").promises.unlink(file, () => {
        return;
      });
      setTimeout(async () => {
        await msg.delete().catch(() => {});
      }, time);
    });
};
