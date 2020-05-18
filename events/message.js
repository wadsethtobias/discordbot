exports.run = async (bot, config, message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(config.prefix)) {

        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        cmd = cmd.toLowerCase();
        let args = messageArray.slice(1);

        let commandfile = bot.commands.get(cmd.slice(config.prefix.length));
        if (!commandfile) {
            console.log(message.member.user.tag + "  tried to run command: " + cmd + ". However Command does not exist!");
            message.delete().catch(console.error);
            return;
        }
        console.log(message.member.user.tag + " ran command: " + cmd);
        commandfile.run(config, bot, message, args);
        message.delete().catch(console.error);
    }

};