require('dotenv').config();
const config = require("./config.json");
const Discord = require("discord.js");
const { Client, MessageEmbed } = require('discord.js');
const bot = new Client();
const fs = require("fs");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./cmds/", (err, folders) => {
    folders.forEach(item => {
        fs.readdir(`./cmds/${item}`, (err, files) => {
            if(err) console.error(err);

            let jsfiles = files.filter(f => f.split(".").pop() === "js");
            if(jsfiles.length <= 0) {
                console.log(`No commands to load in ${item}!`);
                return;
            }
            
            console.log(`Loading ${jsfiles.length} commands from ${item}!`);
        
            jsfiles.forEach((f, i) => {
                let props = require(`./cmds/${item}/${f}`);
                console.log(`${i + 1} ${f}!`);
                bot.commands.set(props.help.name, props);
                props.help.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.help.name);
                });
            });
        });

    });
});

bot.on('ready', async () => {
    console.log(`${bot.user.username} is online!`);
    const CLIENTGUILDS = bot.guilds.cache.filter(guild => guild);
    bot.user.setActivity(`For ${config.pref}tags${config.suff} in ${CLIENTGUILDS.size} servers!`, { type: 'WATCHING' });
});

// Primary command identifier
bot.on("message", async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    let args = '';
    if(msg.content.includes(config.pref)&&msg.content.includes(config.suff)){
        args = msg.content.slice(msg.content.indexOf(config.pref)+config.pref.length, msg.content.indexOf(config.suff)).trim().split(/ +/g);
    }else{
        return;
    }
    let cmd = args.shift().toLowerCase();
    let command;
    if(bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else {
        command = bot.commands.get(bot.aliases.get(cmd));
    }
    if(command) command.run(bot, msg, args, config);

});


bot.on("message", async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
    if(msg.channel.name != 'node-network') return;


    let embed = new MessageEmbed({
        author: {
            name: msg.author.username,
            icon_url: msg.author.displayAvatarURL(),
        },
        description: msg.content,
        color: msg.member.displayHexColor,
        footer: {
            text: msg.guild.name,
            icon_url: msg.guild.iconURL()
        }
    });
    let attachment = msg.attachments.first();
    if(attachment) embed.setImage(attachment.url);
    bot.guilds.cache.filter(g => g != msg.guild && g.channels.cache.find(c => c.name == 'node-network')).array().forEach(g => g.channels.cache.find(c => c.name == 'node-network').send(embed));

})


bot.login(process.env.TOKEN);