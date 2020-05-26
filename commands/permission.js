const Discord = require("discord.js")
const utils = require("../utils")
const config = require("../config.json")

module.exports.run = async (bot, message, args) => {

    if (!utils.hasPermission(message, message.author, __filename.slice(__dirname.length + 1, -3))) {
        return
    }

    let role = message.mentions.roles.first()
    let inputCommand = args[2]
    if (inputCommand === undefined) {
        let ember = new Discord.MessageEmbed()
        return
    } else {
        if (args[1].toLowerCase() === "add") {
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
                .setColor(config.color)

                if (commandArr.includes(inputCommand.toLowerCase())) {
                    if (!role) {
                        embed.setDescription("Please specify a role")
                    } else {
                        if (utils.loadPermissions(inputCommand.toLowerCase()).includes(role.id)) {
                            embed.setDescription("That command already has that role")
                        } else {
                            utils.addPermission(inputCommand.toLowerCase(), role.id)
                            embed.setDescription("Successfully added role")
                            let logEmbed = new Discord.MessageEmbed
                            .setDescription(`${message.author} has just added the role ${role} to ${inputCommand.toLowerCase()}`)
                            .setColor(config.color)

                            utils.log(message, logEmbed)
                        }
                    }
                } else {
                    embed.setDescription("That is not a valid command, please do [" + config.prefix + "config commands] to see a list of all commands")
                }
        
                message.channel.send(embed)
                
            })
        } else if (args[1].toLowerCase() === "remove") {
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
                .setColor(config.color)

                if (commandArr.includes(inputCommand.toLowerCase())) {
                    if (!role) {
                        embed.setDescription("Please specify a role")
                    } else {
                        if (utils.loadPermissions(inputCommand.toLowerCase()).includes(role.id)) {
                            utils.removePermission(inputCommand.toLowerCase(), role.id)
                            embed.setDescription("Successfully removed role")
                            let logEmbed = new Discord.MessageEmbed
                            .setDescription(`${message.author} has just removed the role ${role} from ${inputCommand.toLowerCase()}`)
                            .setColor(config.color)

                            utils.log(message, logEmbed)
                        } else {
                            embed.setDescription("That command does not have that role")
                        }
                    }
                } else {
                    embed.setDescription("That is not a valid command, please do [" + config.prefix + "config commands] to see a list of all commands")
                }
        
                message.channel.send(embed)
                
            })
        } else if (args[1].toLowerCase() === "list") {
            console.log(args[2])
            let perms = utils.loadPermissions(input)
            let embed = new Discord.MessageEmbed()
            .setDescription(`${command}'s Permission Roles`)
            .setColor(config.color)
            .addField("\u200b", "\u200b" + perms.join(", "))

            message.channel.send(embed)
        }
    }
}

module.exports.help = {
    name: "permission"
}