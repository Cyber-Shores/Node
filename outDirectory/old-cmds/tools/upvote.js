const config = module.require('../../config.json');
const Discord = module.require('discord.js');
const { MessageEmbed } = module.require('discord.js');
module.exports.run = async (bot, msg, args) => {
    const m = await msg.channel.send('```Generating list...```');
    const embed = await new MessageEmbed({
        title: "Upvote Node here!",
        description: '[top.gg](https://top.gg/bot/722615667064569867 "you")\n[Discord Bots](https://discord.bots.gg/bots/722615667064569867 "found")\n[Bots On Discord](https://bots.ondiscord.xyz/bots/722615667064569867 "an")\n[Abstract List](https://abstractlist.com/bot/722615667064569867?message=Successfully%20voted%20for%20Node "easter")\n[Discord Bot List](https://discordbotlist.com/bots/node "egg")\n[Disboard](https://disboard.org/server/722644695985029270 "🥚")',
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`,
        },
        timestamp: new Date(),
        color: (msg.member.displayHexColor),
    });
    m.delete();
    msg.channel.send(embed);
};
module.exports.help = {
    name: 'upvote',
    category: 'Tools',
    reqPerms: [],
    description: 'Sends a list of upvotable pages for Node',
    usage: `${config.pref}upvote${config.suff}`,
    aliases: [],
};
