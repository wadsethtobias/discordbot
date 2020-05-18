const Discord = require("discord.js")
const config = require("../config.json")
const utils = require("../utils")
const fs = require("fs")

exports.run = async (config, bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    // warn @user this is the reason
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
    if (!user) return message.channel.send("That user cannot be found")
    let reason = args.join(" ").slice(22)

    let embed = new Discord.MessageEmbed()
    .setDescription("Warning")
    .setColor(config.color)
    .addField("Warned User", `${user} (ID: ${user.id})`)
    .addField("Warned By", `<@${message.author.id}> (ID: ${message.author.id})`)
    .addField("Reason", reason)

    message.channel.send(embed)
    utils.log(message, embed)

    utils.warn(message.author, user, reason)

}

module.exports.help = {
    name: "warn"
}