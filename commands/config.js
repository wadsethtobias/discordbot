const Discord = require("discord.js")
const utils = require("../utils")
const config = require("../config.json")
const fs = require("fs")

module.exports.run = async (bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    // config setlogchannel <#channel>
    // config setsuggestionschannel <#channel>
    // config setsuggestionslogchannel <#channel>
    // config permission [add|remove|list] command <@role>
    // config commands

    if (args[0].toLowerCase() === "setlogchannel") {
        let channel = message.mentions.channels.first()
        utils.updateLog(channel.id)
        message.channel.send(`Successfully updated the log channel to ${channel}`)
    } else if (args[0].toLowerCase() === "setsuggestionschannel") {
        let channel = message.mentions.channels.first()
        utils.updateSuggestionsChannel(channel.id)
        message.channel.send(`Successfully updated the suggestions channel to ${channel}`)
    } else if (args[0].toLowerCase() === "setsuggestionslogchannel") {
        let channel = message.mentions.channels.first()
        utils.updateSuggestionsLogChannel(channel.id)
        message.channel.send(`Successfully updated the suggestions channel to ${channel}`)
    } else if (args[0].toLowerCase() === "commands") {

        fs.readdir("./commands/", (err, file) => {
            if (err) return console.error(err)
            let commandArr = new Array()

            let commands = file.filter(c => c.split(".").pop() === "js")
            if (commands <= 0) {
                return console.error("Could not find any commands!")
            }
            commands.forEach((command, index) => {
                commandArr.push(command.split(".")[0])
            })

            let embed = new Discord.MessageEmbed()
            .setDescription("Commands")
            .setColor(config.color)
            .addField("\u200b", commandArr.join(", "))
    
            message.channel.send(embed)
            
        })
    } else if (args[0].toLowerCase() === "prefix") {
        let temp = args[1]
        if (temp === undefined) {
            let embed = new Discord.MessageEmbed()
            .setDescription("Please enter a prefix")
            .setColor(config.color)
    
            message.channel.send(embed)
            return
        }
        let embed = new Discord.MessageEmbed()
        .setDescription("Successfully set the prefix")
        .setColor(config.color)

        utils.setPrefix(temp)

        message.channel.send(embed)
    }

}

module.exports.help = {
    name: "config"
}