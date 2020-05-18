const Discord = require("discord.js")
const config = require("../config.json")
const ms = require("ms")
const utils = require("../utils.js")
const moment = require("moment")

exports.run = async (config, bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    // tempban @user time(1w2d) reason
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
    if (!user) return message.channel.send("That user cannot be found")
    args.shift()
    let time = ms(args[0])
    if (time === undefined) {
        let embed = new Discord.MessageEmbed()
        .setDescription("Please enter a valid time e.g. 1w")
        .setColor(config.color)
    
        message.channel.send(embed)
        return
    }
    let endTime = new Date().getTime() + time
    let endDate = moment(new Date(endTime)).format('MMMM Do YYYY, h:mm:ss a')
    args.shift()
    let reason = args.join(" ")

    let embed = new Discord.MessageEmbed()
    .setDescription("Ban")
    .setColor(config.color)
    .addField("Banned User", `${user} (ID: ${user.id})`)
    .addField("Banned By", `<@${message.author.id}> (ID: ${message.author.id})`)
    .addField("Banned Until", endDate)
    .addField("Reason", reason)

    message.channel.send(embed)
    utils.log(message, embed)

    utils.tempBan(user, time, reason)
}

module.exports.help = {
    name: "tempban"
}