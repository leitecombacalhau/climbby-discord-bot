const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");
const Command = require("../structures/Command");

module.exports = new Command({
  commands: ["meme"],
  help: "Returns a meme, optionally you can type the subreddit's name you want the meme from.",
  category: "Fun",
  expectedArgs: "[subreddit]",
  permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS"],
  permissionError: "You do not have permission to run this command.",
  run: async ({ message, args }) => {
    var sReddit = args[1];
    var random = "";

    const subReddits = [
      "dankmeme",
      "meme",
      "MinecraftMemes",
      "BadDesigns",
      "aww",
      "puppy",
      "blursed",
      "frogs",
      "crappydesign",
      "dankmemes",
      "me_irl",
      "wholesomememes",
      "memeeconomy",
      "adviceanimals",
      "comedycemetery",
      "memes",
      "prequelmemes",
      "terriblefacebookmemes",
      "pewdiepiesubmissions",
      "funny",
    ];

    if (sReddit === "" || !sReddit || sReddit == undefined) {
      random = subReddits[Math.floor(Math.random() * subReddits.length)];
    } else {
      random = sReddit;
    }
    try {
      const url = `https://www.reddit.com/r/${random}.json?sort=top&t=week`;

      const { body } = await snekfetch.get(url).query({ limit: 800 });
      const allowed = message.channel.nsfw
        ? body.data.children
        : body.data.children.filter((post) => !post.data.over_18);
      if (!allowed.length)
        return message.channel.send(
          "It seems we are out of fresh memes! Try again later."
        );
      let randomnumber = Math.floor(Math.random() * allowed.length);
      let count = 0;
      while (allowed[randomnumber].data.is_self && count < 800) {
        randomnumber = Math.floor(Math.random() * allowed.length);
        count++;
      }
      if (allowed[randomnumber].data.is_self)
        return message.channel.send(
          "It seems like that subreddit doesn't have any images."
        );

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(allowed[randomnumber].data.url)
        .setDescription("Posted by: " + allowed[randomnumber].data.author)
        .addField(
          "Other info:",
          "Up votes: " +
            allowed[randomnumber].data.ups +
            " / Comments: " +
            allowed[randomnumber].data.num_comments
        )
        .setTitle(allowed[randomnumber].data.title)
        .setURL(allowed[randomnumber].url)
        .setFooter({
          text: `Memes provided by ${allowed[randomnumber].data.subreddit_name_prefixed}`,
        });

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      if (err.body.reason === "private") {
        return message.reply("Looks like that subreddit is private.");
      }
      message.reply(`The subreddit you provided is invalid or unaccessible.`);
    }
  },
});
