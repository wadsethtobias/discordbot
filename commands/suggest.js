const Discord = require("discord.js")
const config = require("../config.json")
const utils = require("../utils")

exports.run = async (config, bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }
    // suggest suggestion
    utils.addSuggestion(message, message.author, args)

}

module.exports.help = {
    name: "suggest"
}