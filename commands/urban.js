const { MessageEmbed } = require("discord.js");
const https = require("https");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["urban"],
  help: "Returns the mention word's/expression urban dictionary explanation.",
  category: "Misc",
  expectedArgs: "<word/expression>",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args }) => {
    args.shift();
    if (!args[0]) {
      message.reply(
        "Please define a word/expression to get the urban dictionary explanation of."
      );
    } else {
      let msg = args[0];
      term(msg, function (error, entries) {
        if (error) {
          console.error(error.message);
          message.channel.send({ content: error.message });
        } else {
          if (entries.length == 1) {
            const embed = new MessageEmbed({
              color: 9384170,
              title: "**" + entries[0].word + "**",
              fields: [
                {
                  name: "Definition",
                  value: entries[0].definition,
                },
                {
                  name: "**Example**",
                  value: entries[0].example,
                },
              ],
            });
            message.channel.send({
              embeds: [embed],
            });
          } else if (entries.length > 1) {
            if (
              entries[0].definition.length < 1024 &&
              entries[1].definition.length < 1024 &&
              entries[0].example.length < 1024 &&
              entries[0].example.length < 1024
            ) {
              const embed = new MessageEmbed({
                color: 9384170,
                title: "**" + entries[0].word + "**",
                fields: [
                  {
                    name: "Definition",
                    value: entries[0].definition,
                  },
                  {
                    name: "Second Definition",
                    value: entries[1].definition,
                  },
                  {
                    name: "**First Example**",
                    value: entries[0].example,
                  },
                  {
                    name: "**Second Example**",
                    value: entries[1].example,
                  },
                ],
              });
              message.channel.send({
                embeds: [embed],
              });
            } else {
              console.log("Error");
              console.log(
                "Length of entries[0].definition " +
                  entries[0].definition.length
              );
              console.log(
                "Length of entries[1].definition " +
                  entries[1].definition.length
              );
              console.log(
                "Length of entries[1].example " + entries[1].example.length
              );
              console.log(
                "Length of entries[0].example " + entries[0].example.length
              );
            }
          }
        }
      });
    }
  },
});

function get(url, callback) {
  https.get(url, function (result) {
    const contentType = result.headers["content-type"];
    const statusCode = result.statusCode;

    let error;
    if (statusCode !== 200) {
      error = new Error(
        "Unable to send request for definitions. Status code: " + statusCode
      );
    } else if (contentType.indexOf("application/json") === -1) {
      error = new Error(
        "Content retrieved isn't JSON. Content type: '" + contentType + "'"
      );
    }

    if (error) {
      // Removes response data to clear up memory.
      result.resume();
      callback(error);
      return;
    }

    result.setEncoding("utf8");

    let rawData = "";
    result.on("data", function (buffer) {
      rawData += buffer;
    });
    result.on("end", function () {
      try {
        callback(null, JSON.parse(rawData));
      } catch (error) {
        callback(new Error("Failed to parse retrieved Urban Dictionary JSON."));
        console.log("rawData is: " + rawData);
      }
    });
  });
}

function term(word, callback) {
  get(
    "https://api.urbandictionary.com/v0/define?term=" +
      encodeURIComponent(word),
    function (error, result) {
      if (error) {
        callback(error);
        return;
      }

      if (!result) {
        callback(new Error(word + " is undefined."));
        return;
      }

      callback(null, result.list);
    }
  );
}
