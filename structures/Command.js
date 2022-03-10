/** @format */

const Client = require("./Client.js");

const Discord = require("discord.js");

const mongoose = require("mongoose");

/**
 * @typedef {{message: Discord.Message | Discord.Interaction, args: string[], client: Client, guildCollection: mongoose.Model, prefix: string, defaultPrefix: string}} CommandArgs
 * @param {CommandArgs} commandArgs
 */
function RunFunction(commandArgs) {}

class Command {
  /**
   * @typedef {{commands: string[], help: string, category: string, expectedArgs: string, permissions: string[], permissionError: string, run: RunFunction}} CommandOptions
   * @param {CommandOptions} options
   */
  constructor(options) {
    this.commands = options.commands;
    this.help = options.help;
    this.category = options.category;
    this.expectedArgs = options.expectedArgs;
    this.permissions = options.permissions;
    this.permissionError = options.permissionError;
    this.run = options.run;
  }
}

module.exports = Command;
