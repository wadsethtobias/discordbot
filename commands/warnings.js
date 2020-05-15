const Discord = require("discord.js")
const utils = require("../utils.js")
const config = require("../config.json")
const moment = require("moment")

module.exports.run = async (bot, message, args) => {

    if (!utils.hasPermission(message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    // warnings @user
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]))
    if (!user) return message.channel.send("That user cannot be found")

    const warnings = utils.getWarnings(user)

    let embed = new Discord.MessageEmbed()
    .setDescription(`${user}'s Warnings`)
    .setColor(config.color)

    if (warnings === undefined) {
        embed
        .addField("\u200b", "This user has no warnings")
    } else {
        warnings.forEach(warning => {
            for (let key of Object.keys(warning)) {
                let moderator = message.guild.member(warning[key].warnedBy)
                console.log(moderator)

                embed
                .addField(`UID: ${key} | Moderator: ${moderator.user.username}#${moderator.user.discriminator}`, `${warning[key].reason} - ${moment(new Date(warning[key].warnedTime)).format('MMMM Do YYYY')}`)
            }
        })
    }

    message.channel.send(embed)
}

module.exports.help = {
    name: "warnings"
}