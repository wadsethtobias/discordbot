const config = require("./config.json")
const Discord = require("discord.js")
const utils = require("./utils")
const fs = require("fs")

const bot = new Discord.Client()
bot.commands = new Discord.Collection()

//Command Loader
fs.readdir("./commands/", (err, file) => {
    if (err) return console.error(err)

    let commands = file.filter(c => c.split(".").pop() === "js")
    if (commands <= 0) {
        return console.error("Could not find any commands!")
    }

    commands.forEach((command, index) => {
        let props = require(`./commands/${command}`)
        bot.commands.set(props.help.name, props)
        console.log(`${command.split(".")[0]} command loaded`)
    })
    
})

//Events "handler"
fs.readdir('./events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        console.log("Successfully loaded event: " + file);
        let eventName = file.split(".")[0];
        bot.on(eventName, (...args) => eventFunc.run(bot, config, ...args));
    });
});

bot.on("ready", async () => {
    bot.user.setActivity(`on ${config.ip}`)

    utils.loadTempBan(bot)

    console.log(`${bot.user.username} is online`)
    console.log('Ready!')  //for pterodactel to pick up the bot is online
})

//bot.on("message", async message => {

//    let prefix = config.prefix
//    let arr = message.content.split(" ")
//    let cmd = arr[0]
//    let args = arr.slice(1)

//    let command = bot.commands.get(cmd.slice(prefix.length))

//    if (command) command.run(bot, message, args)
//})

bot.login(config.token)
