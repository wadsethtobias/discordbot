const Discord = require("discord.js")
const utils = require("../utils")
const config = require("../config.json")

module.exports.run = async (bot, message, args) => {

    if (!utils.hasPermission(message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    // kick @user the rest is the reason
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
    if (!user) return message.channel.send("That user cannot be found")
    let reason = args.join(" ").slice(22)

    let embed = new Discord.MessageEmbed()
    .setDescription("Kick")
    .setColor(config.color)
    .addField("Kicked User", `${user} (ID: ${user.id})`)
    .addField("Kicked By", `<@${message.author.id}> (ID: ${message.author.id})`)
    .addField("Reason", reason)

    message.channel.send(embed)
    utils.log(message, embed)

    user.kick(reason)

}

module.exports.help = {
    name: "kick"
}