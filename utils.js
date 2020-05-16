const Discord = require("discord.js")
const config = require("./config.json")
const fs = require("fs")
const nanoid = require("nanoid")
const moment = require("moment")

let permissions = require("./permissions.json")
let tempbans = require("./tempbans.json")
let warnings = require("./warnings.json")
let suggestions = require("./suggestions.json")

module.exports.log = (message, messageToSend) => {
    let logchannel = message.guild.channels.cache.find(channel => channel.id === config.logchannel)
    if (logchannel) {
        return logchannel.send(messageToSend)
    }
    return console.log("No log channel found\nLink a channel with " + config.prefix + "config setlogchannel <#channel>")
}

module.exports.updateLog = id => {
    config.logchannel = id
    fs.writeFileSync("./config.json", JSON.stringify(config), (err) => {
        if (err) console.error(err)
    })
}

module.exports.getLogID = () => {
    return config.logchannel
}

module.exports.hasPermission = async (message, sender, command) => {
    let user = await message.guild.members.fetch(sender.id)
    if (user.hasPermission("ADMINISTRATOR")) return true
    let permArr = permissions[command]
    if (permArr === undefined) {
        return false
    }
    permArr.forEach(perm => {
        let statement = false
        if (statement) {
            return statement
        }
        statement = user.roles.cache.includes(perm)
    })
    return false
}

module.exports.loadPermissions = command => {
    return permissions[command] === undefined ? [] : permissions[command]
}

module.exports.addPermission = (command, role) => {
    let perms = permissions[command]

    if (perms === undefined) {
        permissions[command] = [role]
    } else {
        perms.push(role)
        permissions[command] = perms
    }
    fs.writeFileSync("./permissions.json", JSON.stringify(permissions), (err) => {
        if (err) console.error(err)
    })
}

module.exports.removePermission = (command, role) => {
    let perms = permissions[command]

    if (perms === undefined) {
        return "Could not find that permission"
    }
    if (permissions[command].includes(role)) {
        const index = array.indexOf(5);
        if (index > -1) {
            perms.splice(index, 1);
            permissions[command] = perms
            fs.writeFileSync("./permissions.json", JSON.stringify(permissions), (err) => {
                if (err) console.error(err)
            })
            return "Successfully removed permission"
        }
    }
    return "Could not find that permission"
}

module.exports.loadTempBan = (bot) => {
    let bans = tempbans
    setInterval(() => {
        for (let key of Object.keys(tempbans)) {
            // console.log(key)
            let time = new Date().getTime()
            // console.log(time, tempbans[key].endTime)
            if (time >= tempbans[key].endTime) {
                // console.log(bot.guilds.cache)
                bot.guilds.cache.forEach(guild => {
                    guild.members.unban(tempbans[key].id)

                    let embed = new Discord.MessageEmbed()
                    .setDescription("Unban")
                    .setColor(config.color)
                    .addField("Unbanned User", `${tempbans[key].user} (ID: ${tempbans[key].id})`)
                    .addField("Reason", "Ban expired")
                    console.log(`Unbanned ${tempbans[key].user}`)

                    let logchannel = guild.channels.cache.find(channel => channel.id === config.logchannel)
                    if (logchannel) {
                        logchannel.send(embed)
                    }
                    console.log("No log channel found\nLink a channel with " + config.prefix + "config setlogchannel <#channel>")

                    delete tempbans[key]
                    fs.writeFileSync("./tempbans.json", JSON.stringify(tempbans), (err) => {
                        if (err) console.error(err)
                    })
                })
            }
        }
    }, 1000)
}

module.exports.tempBan = (user, time, reason) => {
    let curTime = new Date().getTime()
    let banEnd = curTime + time
    let uid = nanoid.nanoid()
    tempbans[uid] = {
        endTime: banEnd,
        id: user.id,
        user: user.displayName
    }
    user.ban(reason)
    fs.writeFileSync("./tempbans.json", JSON.stringify(tempbans), (err) => {
        if (err) console.error(err)
    })
}

module.exports.warn = (sender, target, reason) => {
    let curTime = new Date().getTime()
    let uid = nanoid.nanoid()
    if (warnings[target.id] === undefined) {
        let warns = [{
            [uid]: {
                warnedBy: sender.id,
                warnedTime: curTime,
                reason: reason
            }
        }]
        warnings[target.id] = warns
    } else {
        let warns = warnings[target.id]
        warns.push({
            [uid]: {
                warnedBy: sender.id,
                warnedTime: curTime,
                reason: reason
            }
        })
        warnings[target.id] = warns
    }
    console.log(warnings[target.id])
    fs.writeFileSync("./warnings.json", JSON.stringify(warnings), (err) => {
        if (err) console.error(err)
    })
}

module.exports.getWarnings = user => {
    return warnings[user.id]
}

module.exports.removeWarning = (user, uid) => {
    if (warnings[user.id][uid] === undefined) {
        return null
    }
    let warning = warnings[user.id][uid]
    delete warnings[user.id][uid]
    fs.writeFileSync("./warnings.json", JSON.stringify(warnings), (err) => {
        if (err) console.error(err)
    })
    return warning
}

module.exports.setPrefix = prefix => {
    config.prefix = prefix
    fs.writeFileSync("./config.json", JSON.stringify(config), (err) => {
        if (err) console.error(err)
    })
}

module.exports.addSuggestion = async (message, user, suggestion) => {
    let uid = nanoid.nanoid()

    let time = new Date()

    let logchannel = message.guild.channels.cache.find(channel => channel.id === config.suggestionschannel)
    if (logchannel) {
        let embed = new Discord.MessageEmbed()
        .setDescription(suggestion.join(" "))
        .setFooter(`Suggestion ID: ${uid} | Suggested at ${moment(time).format("MMMM Do YYYY, h:mm:ss a")}`)
        .setColor(config.color)
        .setThumbnail(user.avatarURL())
        .setAuthor(`Suggestion from ${user.tag}`, user.avatarURL())

        const filter = m => m
        logchannel.awaitMessages(filter, { max: 1, time: 3000, errors: ['time'] })
        .then(collected => {

            // collected.first().react("👍").then(test => {
            //     test.message.react("👎")
            // })
            // collected.first().react("👎")
            suggestions[uid] = {
                user: user.id,
                suggestion: suggestion.join(" "),
                suggestionEmbed: collected.first().id
            }
    
            fs.writeFileSync("./suggestions.json", JSON.stringify(suggestions), (err) => {
                if (err) console.error(err)
            })
        })
        .catch(console.error)

        const msg = await logchannel.send(embed)
        await msg.react("👍")
        await msg.react("👎")
        await msg.react("📩")

    } else {
        message.channel.send("No suggestions log channel found\nLink a channel with " + config.prefix + "config setsuggestionchannel <#channel>")
    }
}

module.exports.modSuggestion = (message, sender, action, uid) => {
    if (action.toLowerCase() === "approve") {
        if (suggestions[uid] === undefined) {
            message.channel.send("No suggestion with that uid could be found")
            return
        }
    
        let logchannel = message.guild.channels.cache.find(channel => channel.id === config.suggestionslogchannel)
        let channel = message.guild.channels.cache.find(channel => channel.id === config.suggestionschannel)
        channel.messages.fetch(suggestions[uid].suggestionEmbed)
        .then(s => {
            let up = -1
            let down = -1
            let reactions = s.reactions
            reactions.cache.forEach(reaction => {
                if (reaction.emoji.name === "👍") {
                    up++
                } else if (reaction.emoji.name === "👎") {
                    down++
                }
            })
            if (channel && logchannel) {
                s.delete()
                let embed = new Discord.MessageEmbed()
                .setTitle(`Approved Suggestion`)
                .addField("Suggestion", suggestions[uid].suggestion)
                .addField("Accepted By", sender)
                .addField("Votes", `👍 ${up} | ${down} 👎`)
                .setColor(config.color)
                logchannel.send(embed)
        
                delete suggestions[uid]
                fs.writeFileSync("./suggestions.json", JSON.stringify(suggestions), (err) => {
                    if (err) console.error(err)
                })
            }
        })
        .catch(console.error)
    } else if (action.toLowerCase() === "reject") {
        if (suggestions[uid] === undefined) {
            message.channel.send("No suggestion with that uid could be found")
            return
        }
    
        let logchannel = message.guild.channels.cache.find(channel => channel.id === config.suggestionslogchannel)
        let channel = message.guild.channels.cache.find(channel => channel.id === config.suggestionschannel)
        channel.messages.fetch(suggestions[uid].suggestionEmbed)
        .then(s => {
            let up = -1
            let down = -1
            let reactions = s.reactions
            reactions.cache.forEach(reaction => {
                if (reaction.emoji.name === "👍") {
                    up++
                } else if (reaction.emoji.name === "👎") {
                    down++
                }
            })
            if (channel && logchannel) {
                s.delete()
                let embed = new Discord.MessageEmbed()
                .setTitle(`Rejected Suggestion`)
                .addField("Suggestion", suggestions[uid].suggestion)
                .addField("Rejected By", sender)
                .addField("Votes", `👍 ${up} | ${down} 👎`)
                .setColor(config.color)
                logchannel.send(embed)
        
                delete suggestions[uid]
                fs.writeFileSync("./suggestions.json", JSON.stringify(suggestions), (err) => {
                    if (err) console.error(err)
                })
            }
        })
        .catch(console.error)
    }
}

module.exports.updateSuggestionsChannel = channel => {
    config.suggestionschannel = channel
    fs.writeFileSync("./config.json", JSON.stringify(config), (err) => {
        if (err) console.error(err)
    })
}

module.exports.updateSuggestionsLogChannel = channel => {
    config.suggestionslogchannel = channel
    fs.writeFileSync("./config.json", JSON.stringify(config), (err) => {
        if (err) console.error(err)
    })
}