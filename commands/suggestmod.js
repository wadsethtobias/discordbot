const Discord = require("discord.js")
const config = require("../config.json")
const utils = require("../utils")

module.exports.run = async (bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    // suggestmod (action (accept|reject)) (uid)
    let action = args[0]
    let uid = args[1]
    if (action === undefined) {
        message.channel.send("Please enter an action (accept|reject)")
        return
    }
    if (uid === undefined) {
        message.channel.send("Please enter an uid")
        return
    }
    utils.modSuggestion(message, message.author, action, uid)

}

module.exports.help = {
    name: "suggestmod"
}