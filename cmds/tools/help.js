const {Client, MessageEmbed} = module.require("discord.js");
const config = module.require("../../config.json");
const { Menu } = module.require('discord.js-menu');
module.exports.run = async (bot, msg, args) => {
    let m =  await msg.channel.send("```Generating menu...```");
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    if (!args[0]) {
        msg.delete();
        let embed = new MessageEmbed({
            title: "Help",
            description: "Commands:",
            color: msg.member.displayHexColor
        });
        bot.commands.forEach(element => {
            let hasPerms = true;
            element.help.reqPerms.forEach(perm => {
                if(!msg.member.permissions.has(perm)) hasPerms = false;
            });

            if(hasPerms){
                embed.addField(element.help.name, element.help.usage);
            }
        });
        new Menu(msg.channel, msg.author.id, [
            {
                name: "main",
                content: embed,
                reactions: {
                    "⏹": "stop",
                    "⚙": "About"
                }
            },
            {
                name: "About",
                content: new MessageEmbed({
                    title: "About",
                    description: "About The Bot",
                    color: randomColor,
                    fields: [
                        {
                            name: "Creators",
                            value: `\`\`\`${bot.users.cache.get('265499320894095371').tag}\n${bot.users.cache.get('568087768530419732').tag}\`\`\``
                            // (Each page can only have 20 reactions, though. Discord's fault.)
                        },
                        {
                            name: "Lead Artist",
                            value: `\`\`\`dom#9445\`\`\``
                        }
                    ]
                }),
                reactions: {
                    "⏹": "stop",
                    "◀": "previous"
                }
            }
        ]);
        m.delete();
    }else{
        let hasPerms = true;
        bot.commands.get(args[0]).help.reqPerms.forEach(perm => {
            if(!msg.member.permissions.has(perm)) hasPerms = false;
        });
        if(!hasPerms){
            m.delete();
            return msg.channel.send(new MessageEmbed({
                title: client.commands.get(args[0]).help.name,
                description: '```❌ You do not have access to this command```',
                color: 0xff0000
            }));
        }
        msg.channel.send(new MessageEmbed({
            title: bot.commands.get(args[0]).help.name,
            description: `\`\`\`${bot.commands.get(args[0]).help.usage}\`\`\`\n${bot.commands.get(args[0]).help.description}`,
            fields: [
                {name: 'Aliases', value: bot.commands.get(args[0]).help.aliases.join(", ") || "None"},
            ],
            color: msg.member.displayHexColor
        
        }));
        m.delete()
        msg.delete()
    }
    
}

module.exports.help = {
    name: "help",
    reqPerms: [],
    description: "Menu with info about this bot and usage of its commands",
    usage: `${config.pref}help${config.suff} || ${config.pref}help [command]${config.suff}`,
    aliases: ['h']
}