const Discord = module.require('discord.js');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg, args) => {
    if (!args[0])
        return require('../../util/errMsg.js').run(bot, msg, true, 'Please provide a bet.');
    const oddsembed = new Discord.MessageEmbed()
        .setTitle('Odds')
        .addField('Red/Black', '47.4%')
        .addField('Green', '5.5%')
        .addField('Single Number', '2.6%')
        .setDescription('The game is provably fair using only a random number Generator');
    if (args[0] == 'odds')
        return msg.channel.send(oddsembed);
    const randnum = Math.floor(Math.random() * 38) + 1;
    const randnum1 = randnum.toString();
    if (args[0] > 38 || args[0] < 1)
        return require('../../util/errMsg.js').run(bot, msg, true, 'Please place a bet between 1 and 38.');
    let colour;
    let result;
    if (randnum <= 18) {
        colour = `red`;
        if (args[0] == `red`) {
            result = `win`;
        }
    }
    else if (randnum >= 21) {
        colour = `black`;
        if (args[0] == `black`) {
            result = `win`;
        }
    }
    else if (randnum == 19 || randnum == 20) {
        colour = `green`;
        if (args[0] == `green`) {
            result = `win`;
        }
    }
    else if (randnum1 == args[0]) {
        result = `win`;
    }
    if (args[0] == randnum1) {
        result = `win`;
    }
    if (result !== `win`) {
        result = `loss`;
    }
    const embed = new Discord.MessageEmbed({
        title: 'Roulette',
        description: `You bet on ${args[0]}`,
        fields: [
            {
                name: `Number:`,
                value: `${randnum}`,
                inline: true,
            },
            {
                name: `Colour:`,
                value: `${colour}`,
                inline: true,
            },
            {
                name: `Resut:`,
                value: `${result}`,
                inline: true
            },
        ],
        color: msg.member.displayHexColor,
        timestamp: new Date(),
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`,
        },
    });
    return msg.channel.send(embed);
};
module.exports.help = {
    name: 'roulette',
    category: 'Gambling',
    reqPerms: [],
    description: 'Roll the Dice with a game of roulette',
    usage: `${config.pref}roulette2 [green|-|*1-36*|-|red|-|black|-|odds]${config.suff}`,
    aliases: [],
};
