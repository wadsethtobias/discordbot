const Discord = require("discord.js")
const config = require("../config.json")
const utils = require("../utils")

module.exports.run = async (bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    if (args[0] === undefined) {
        let embed = new Discord.MessageEmbed()
        .setDescription("Please enter a User ID")
        .setColor(config.color)

        message.channel.send(embed)
        return
    }

    try {
        const banList = await message.guild.fetchBans()

        const bannedUser = banList.find(user => user.id === args[0])

        if (bannedUser) {
            let embed = new Discord.MessageEmbed()
            .setDescription("Unban")
            .setColor(config.color)
            .addField("Unbanned User", `${bannedUser} (ID: ${bannedUser.id})`)
            .addField("Unbanned By", `<@${message.author.id}> (ID: ${message.author.id})`)

            message.guild.members.unban(bannedUser)

            message.channel.send(embed)
            utils.log(message, embed)

        } else {
            let embed = new Discord.MessageEmbed()
            .setDescription("That user is not banned")
            .setColor(config.color)

            message.channel.send(embed)
        }
    } catch (err) {
        console.error(err)
    }


}

module.exports.help = {
    name: "unban"
}