const Discord = require("discord.js");

exports.run = async (client, config, member) => {
    console.log(`New Member Joined: ${member}`);
    var channelEmbed = new Discord.RichEmbed()
        .setColor(config.colours.guildMemberAdd)
        .setThumbnail(user.avatarURL())
        .setTitle(`A Member Joined`)
        .setDescription(`Name: ${member}`)
        .setFooter(`Joined at ${moment(time).format("MMMM Do YYYY, h:mm:ss a")}`)
        .setAuthor(`Suggestion from ${user.tag}`, user.avatarURL())
    client.channels.get(config.channels.channelUpdates).send(channelEmbed)
};
