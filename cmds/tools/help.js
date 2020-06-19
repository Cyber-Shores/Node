const {Client, MessageEmbed} = module.require("discord.js");
const config = module.require("../../config.json");
const { Menu } = module.require('discord.js-menu');
const git = require('async-git');
 
module.exports.run = async (bot, msg, args) => {
    function calcDate(date1,date2) {
        var diff = Math.floor(date1.getTime() - date2.getTime());
        var day = 1000 * 60 * 60 * 24;
        var message = "";
        var days = Math.floor(diff/day);
        if(days<31){
            return days + " days ";
        }
        var months = Math.floor(days/31);
        if(months<12){
            var daysLeft = days-months*31;
            message+= months + " months and ";
            message+= daysLeft + " days ";
            return message;
        }
        var years = Math.floor(months/12);
        var monthsLeft = months - years*12;
        var daysLeft = days-months*31;
        message+=years+" years, ";
        message+=monthsLeft+" months and ";
        message+=daysLeft+" days ";
        return message;
    }

    let CALCDATEGIT = calcDate(new Date(), await git.date)
    console.log(CALCDATEGIT)
    if(CALCDATEGIT == '0 days ') {
        GITDATE = 'Today!'
    }else{
        GITDATE = `${calcDate(new Date(), await git.date)} ago`
    }

    let tagsarray = await git.tags

    let m =  await msg.channel.send("```Generating menu...```");
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    if (!args[0]) {
        let embed = new MessageEmbed({
            title: "Help",
            description: "Commands:",
            color: msg.member.displayHexColor
        });
        bot.commands.forEach(element => {
            let hasPerms = true;
            try {
                element.help.reqPerms.forEach(perm => {
                    if(!msg.member.permissions.has(perm)) hasPerms = false;
                });
            } catch(e) {
                console.log(e.stack);
            }
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
                    description: `About The Bot`,
                    footer: {
                        text: `${bot.user.username}`,
                        icon_url: `${bot.user.displayAvatarURL()}`
                    },
                    timestamp: new Date(),
                    color: `#07592b`,
                    url: `https://github.com/Cyber-Shores/Node`,
                    fields: [
                        {
                            name: "Developers:",
                            value: `\`\`\`${bot.users.cache.get('265499320894095371').tag}\n${bot.users.cache.get('568087768530419732').tag}\`\`\``,
                            inline: true
                            // (Each page can only have 20 reactions, though. Discord's fault.)
                        },
                        {
                            name: "Lead Artist:",
                            value: `\`\`\`dom#9445\`\`\``,
                            inline: true
                        },
                        {
                            name: `Orginization:`,
                            value: await git.owner,
                            inline: true
                        },
                        {
                            name: `Version:`,
                            value: await tagsarray.slice(-1)[0],
                            inline: true
                        },
                        {
                            name: `Last Updated:`,
                            value: `${GITDATE}`,
                            inline: true
                        },
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
    }
    
}

module.exports.help = {
    name: "help",
    reqPerms: [],
    description: "Menu with info about this bot and usage of its commands",
    usage: `${config.pref}help${config.suff} || ${config.pref}help [command]${config.suff}`,
    aliases: ['h']
}