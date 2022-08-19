const fs = require("fs");
const mongoose = require("mongoose");

const { Permissions, Interaction } = require("discord.js");

const config = require("./config.json");

const Command = require("./structures/Command.js");
const Client = require("./structures/Client.js");

const server = require("./server.js");

const guildCollection = require("./database/guildCollection");

const PORT = config["PORT"];
const HOST = config["HOST"];
const mongoToken = config["MONGOTOKEN"];
const DCToken = config["DCTOKEN"];
const defaultPrefix = config["DCPREFIX"];

const client = new Client();

const writeToLog = ({ data }) => {
  const logger = fs.createWriteStream("./log.txt", {
    flags: "a", // 'a' means appending (old data will be preserved)
  });
  const currentDate = new Date();
  const string = `[${currentDate.toDateString()}, ${currentDate.toLocaleTimeString()}] ${data}`;
  logger.write(string + "\r\n\n");
  // logger.end();
};

const ascii = require("ascii-table");
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

const validatePerms = (perm) => {
  const validPerms = [];
  for (const i in Permissions.FLAGS) {
    validPerms.push(i);
  }

  // fs.writeFileSync(
  //   "./utils/perms.json",
  //   JSON.stringify(Permissions.FLAGS, (key, value) =>
  //     typeof value === "bigint" ? value.toString() : value
  //   )
  // );

  return validPerms.includes(perm);
};

/**
 *
 * @param {Client} client
 */
const run = (client) => {
  client.once("ready", (c) => {
    console.log(
      `Logged as ${c.user.tag} [${new Date().toLocaleString("pt-PT", {
        dateStyle: "full",
        timeStyle: "long",
      })}]`
    );

    c.user.setActivity(`${defaultPrefix}help [cmd]`, {
      type: "PLAYING",
      url: "https://www.youtube.com/channel/UCMNjsTU3LdrhSk0bWveBkIg",
    });

    fs.readdirSync("./commands")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        /**
         * @type {Command}
         */
        const command = require(`./commands/${file}`);
        client.commands.set(command.commands, command);
        table.addRow(file, "✅");
      });
    console.log(table.toString());
  });

  // client.on("interactionCreate", async (interaction) => {});

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    let collection = await guildCollection.findOne({
      Guild: message.guild.id,
    });

    if (collection == null) {
      try {
        let guild = await guildCollection.create({
          Guild: message.guild.id,
          Prefix: defaultPrefix,
          Users: [],
        });
        guild.save();
        collection = await guildCollection.findOne({
          Guild: message.guild.id,
        });
        writeToLog({
          data: `Joined new guild ${message.guild.name} (${message.guild.id})`,
        });
      } catch (err) {
        console.log(err);
        writeToLog({
          data: `Error while joining new guild ${message.guild.name} (${message.guild.id})`,
        });
      }
    }

    const { Prefix } = collection;

    if (!message.content.startsWith(Prefix)) return;

    const args = message.content.substring(Prefix.length).split(/ +/);

    const command = client.commands.find((cmd) =>
      cmd.commands.includes(args[0].toLowerCase())
    );

    if (!command) return; // message.reply(`\`${args[0]}\` is not a valid command!`);

    const permBool = [];

    command.permissions.forEach(async (perm) => {
      if (!validatePerms(perm)) {
        const user = await client.users.fetch("464832300627132416");
        await user.send(
          `[${new Date().toLocaleString("pt-PT", {
            dateStyle: "full",
            timeStyle: "long",
          })}] Invalid permission (${perm}) at ${command.commands}`
        );
        writeToLog({
          data: `Invalid permission (${perm}) at ${command.commands}`,
        });
        throw new Error(`Invalid permission (${perm}) at ${command.commands}`);
      }

      if (!message.member.permissions.has(perm)) return permBool.push(false);
    });

    if (permBool.includes(false)) return message.reply(command.permissionError);

    if (command.category.toLowerCase() === "currency") {
      let res = await guildCollection.findOne({
        Guild: message.guild.id,
      });
      let obj = res["Users"].find((obj) => obj.userID == message.author.id);
      while (!obj) {
        res = await guildCollection.findOneAndUpdate(
          { Guild: message.guild.id },
          {
            $push: {
              Users: {
                userID: message.author.id,
                coins: 1000,
                bank: 0,
                timers: { beg: null, search: null },
              },
            },
          },
          { returnOriginal: false }
        );
        obj = res["Users"].find((obj) => obj.userID == message.author.id);
      }
    }

    const commandArgs = {
      message,
      args,
      client,
      guildCollection,
      prefix: Prefix,
      defaultPrefix,
    };

    command.run(commandArgs);
  });

  client.on("guildDelete", async (guild) => {
    await guildCollection.findOneAndDelete({ Guild: guild.id });
  });

  client.on("guildCreate", async (guild) => {
    const newGuildDocObj = {
      Guild: guild.id,
      Prefix: defaultPrefix,
      Users: [],
    };
    const members = await guild.members.fetch();
    [...members].forEach((m) => {
      newGuildDocObj.Users.push({
        userID: m[1].id,
        coins: 1000,
        bank: 0,
        timers: { beg: null, search: null },
      });
    });

    const newGuildDoc = new guildCollection(newGuildDocObj);
    try {
      await newGuildDoc.save();
    } catch (err) {
      writeToLog({
        data: `Error while adding new profile for the guild ${guild.name} (${guild.id}) in the database`,
      });
      throw err;
    }
  });

  client.on("guildMemberAdd", async (member) => {
    try {
      await guildCollection.updateOne(
        { Guild: member.guild.id },
        {
          $push: {
            Users: {
              userID: member.id,
              coins: 1000,
              bank: 0,
              timers: { beg: null, search: null },
            },
          },
        }
      );
    } catch (err) {
      writeToLog({
        data: `Error while adding new member ${member.username} (${member.id}) to the database`,
      });
    }

    try {
      await client.channels.cache
        .get("1010055980068909056")
        .setName(
          `👤Viewers: ${
            member.guild.members.cache.filter((m) => !m.user.bot).size
          }`
        );
      await client.channels.cache
        .get("947976249106653195")
        .setName(
          `🤖Dogts: ${
            member.guild.members.cache.filter((m) => m.user.bot).size
          }`
        );
    } catch (err) {
      throw err;
    }
  });

  client.on("guildMemberRemove", async (member) => {
    await guildCollection.updateOne(
      { Guild: member.guild },
      {
        $pull: {
          Users: {
            userID: member.id,
          },
        },
      }
    );
    try {
      await client.channels.cache
        .get("1010055980068909056")
        .setName(
          `👤Viewers: ${
            member.guild.members.cache.filter((m) => !m.user.bot).size
          }`
        );
      await client.channels.cache
        .get("947976249106653195")
        .setName(
          `🤖Dogts: ${
            member.guild.members.cache.filter((m) => m.user.bot).size
          }`
        );
    } catch (err) {
      throw err;
    }
  });
};

(async () => {
  try {
    await mongoose.connect(mongoToken);
    console.log("Connected to the database!");
    await client.login(DCToken);
  } catch (err) {
    console.log(err);
  }
})();

run(client);
server(PORT, HOST);
