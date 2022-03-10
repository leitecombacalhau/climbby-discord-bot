const leetify = require("leetify");

const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["hack"],
  help: "Hacks someone.",
  category: "Fun",
  expectedArgs: "<@user>",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message }) => {
    const mention = message.mentions.members.first();

    if (!mention)
      return message.reply("Woah! Slow down... Who are we hacking?!");

    let tohack = mention.user.username.toLowerCase();

    tohack = "not" + tohack.replace(/[ ]+/g, "");

    if (tohack.toString().includes(message.author.username)) {
      message.reply("You can't hack yourself!");
    } else {
      message.channel.send({ content: "**[25%]** Finding IP.." }).then((m) => {
        setTimeout(() => {
          m.edit("**[50%]** IP FOUND! Looking for email and password..").then(
            (m2) => {
              setTimeout(() => {
                m2.edit(
                  `**[75%]** DONE! email: ${tohack}@gmail.com | password: ${leetify(
                    tohack
                  )}`
                ).then((m3) => {
                  setTimeout(() => {
                    m3.edit("**[100%]** Deleting System32..").then((m4) => {
                      setTimeout(() => {
                        m4.edit(
                          `Done hacking ${mention}! All info was sent online.`
                        );
                      }, 5800);
                    });
                  }, 4800);
                });
              }, 4500);
            }
          );
        }, 5000);
      });
    }
  },
});
