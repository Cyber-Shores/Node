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
                console.log(`\nNo commands to load in \u001b[31;1m${item}\u001b[0m!`);
                return;
            }
            
            console.log(`\nLoading \u001b[32;1m${jsfiles.length}\u001b[0m commands from \u001b[32m${item}\u001b[0m!`);
        
            jsfiles.forEach((f, i) => {
                let props = require(`./cmds/${item}/${f}`);
                console.log(`\u001b[32;1m${i + 1}\u001b[0m: \u001b[32m${f}\u001b[0m loaded!`);
                bot.commands.set(props.help.name, props);
                props.help.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.help.name);
                });
            });
        });

    });
});

bot.on('ready', async () => {
  console.log(`\u001b[42m${bot.user.username}\u001b[0m is online!`);
  bot.user.setActivity(`For ${config.pref}tags${config.suff}`, { type: 'WATCHING' });
});

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

bot.login(process.env.TOKEN);