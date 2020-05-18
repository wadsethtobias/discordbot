exports.run = async (config, bot, message, args) => {
    message.channel.send("Pong :) ")

}

module.exports.help = {
    name: "ping"
}