const Discord = require("discord.js")
const utils = require("../utils.js")
const config = require("../config.json")
exports.run = async (config, bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }

    // delwarn @user uid

    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
    if (!user) return message.channel.send("That user cannot be found")
    let uid = args[1]

    if (uid === undefined) {
        let embed = new Discord.MessageEmbed()
        .setDescription("Please enter a uid")
        .setColor(config.color)

        message.channel.send(embed)
        return
    }

    let warning = utils.removeWarning(user, uid)
    let embed = new Discord.MessageEmbed()

    if (warning) {
        embed
        .setDescription(`${message.author} has just removed a warning from ${user}`)
        .setColor(config.color)
        .addField("UID", uid)
        utils.log(message, embed)
    } else {
        embed
        .setDescription(`That uid does not belong to that user`)
        .setColor(config.color)
    }

    message.channel.send(embed)

}

module.exports.help = {
    name: "delwarn"
}