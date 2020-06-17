const { Client, MessageEmbed } = module.require('discord.js');
const config = module.require("../../config.json");
module.exports.run = async (bot, msg, args) => {
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        const embed = new MessageEmbed({
            color: msg.member.displayHexColor,
            thumbnail: {
                url: bot.user.displayAvatarURL()
            },
            title: 'Add the bot!',
            url: link,
            timestamp: new Date(),
            footer: {
                text: `${msg.author.username}`,
                icon_url: `${msg.author.displayAvatarURL()}`
            }
        });
        msg.channel.send(embed);
    } catch(e) {
        console.log(e.stack);
    }
}

module.exports.help = {
    name: "invite",
    reqPerms: [],
    description: "Posts a list of all users of this bot whose usernames contain a certain provided string of text.",
    usage: `${config.pref}invite${config.suff}`,
    aliases: ['link']
}