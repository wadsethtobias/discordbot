const Discord = require("discord.js")
const config = require("./config.json")
const fs = require("fs")
const nanoid = require("nanoid")

let permissions = require("./permissions.json")
let tempbans = require("./tempbans.json")
let warnings = require("./warnings.json")

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

module.exports.hasPermission = (sender, command) => {
    if (sender.roles.cache.hasPermission("ADMINISTRATOR")) return true
    let permArr = permissions[command]
    if (permArr === undefined) {
        return false
    }
    permArr.forEach(perm => {
        let statement = false
        if (statement) {
            return statement
        }
        statement = sender.roles.cache.includes(perm)
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