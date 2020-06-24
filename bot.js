require('dotenv').config();
const config = require("./config.json");
const Discord = require("discord.js");
const { Client, MessageEmbed } = require('discord.js');
const bot = new Client();
const fs = require("fs");
const mongoose = require('mongoose');
const GuildModel = require('./models/GuildData');


// const DBL = require("dblapi.js");  (WIP) cannot finish until bot gets approved on top.gg
// const dbl = new DBL('', bot);

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

//start of connecting to database
//process.env.MONGOLINK used to hide password
mongoose.connect(process.env.MONGOLINK, {
    //mongo connect settings
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    //end
}).then(console.log('\nMongoDB connected!\n'));
//end

//start of command reading
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
//end

//Getting stuff prepared for ready
bot.once('ready', async => {
    //first status set for `ready`
    let CLIENTGUILDS = bot.guilds.cache.filter(guild => guild);
    bot.user.setActivity(`For <prefix> in ${CLIENTGUILDS.size} servers!`, { type: 'WATCHING' });
    //end
    //Creating a doc for each guild if one is not already made
    CLIENTGUILDS.forEach(async guild => {
        const req = await GuildModel.findOne({ id: guild.id });
        if (req) return;
    const doc = new GuildModel({ id: guild.id });
        await doc.save();
        console.log(`Guild Doc Created!`)
        //end
    });
});

//Things to do on guild join
bot.on('guildCreate', async joinedGuild => {
    //activity set
    let CLIENTGUILDS = bot.guilds.cache.filter(guild => guild);
    bot.user.setActivity(`For prefix in ${CLIENTGUILDS.size} servers!`, { type: 'WATCHING' });
    //end
    //creating a doc for each guild joined while on.
    const req = await GuildModel.findOne({ id: joinedGuild.id });
        if (req) return;
    const doc = new GuildModel({ id: joinedGuild.id });
        await doc.save();
        console.log('Doc Created');
    //end
});
//end

//Stuff to do on guild leave
bot.on('guildDelete', async joinedGuild => {
    //deletes server from db
    const req = await GuildModel.findOne({ id: joinedGuild.id });
        if (!req) return;
        await req.deleteOne({ id: joinedGuild.id, fuction(err) {
            if(err) throw err;
        }});
        console.log('Doc Removed');
        //end
});
//end

//Custom prefixes
bot.on('message', async msg => {
        let args = msg.content.split(" ");
    if(!msg.guild) return;
    if(msg.author.bot) return;
    //rudementary command handler
    if (msg.content === '<prefix>') {

        const req = await GuildModel.findOne({ id: msg.guild.id });
        if (!req) return msg.reply('Sorry! doc doesnt exist.');
        let prefixembed = new Discord.MessageEmbed({
            title: `Server Prefix & Suffiix:`,
            description: `Prefix:  ${req.prefix}\nSuffix:  ${req.suffix}\n`,
            color: msg.member.displayHexColor,
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
        });

        return msg.reply(prefixembed);

    }
    //end
});
//end

//Final ready
bot.on('ready', async () => {
    console.log(`${bot.user.username} is online!`);
});
//end

// Primary command identifier
bot.on("message", async msg => {
    const req = await GuildModel.findOne({ id: msg.guild.id });

    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    let args = '';
    if(msg.content.includes(req.prefix)&&msg.content.includes(req.suffix)){
        args = msg.content.slice(msg.content.indexOf(req.prefix)+req.prefix.length, msg.content.indexOf(req.suffix)).trim().split(/ +/g);
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
//end

//Node Network
bot.on("message", async msg => {

    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
    if(msg.channel.name != 'node-network') return;

    //creates new node network message
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
    //end

    //sending
    bot.guilds.cache.filter(g => g != msg.guild && g.channels.cache.find(c => c.name == 'node-network')).array().forEach(g => g.channels.cache.find(c => c.name == 'node-network').send(embed));
    //end
})
//end

bot.login(process.env.TOKEN);