const axios = module.require('axios');
const Discord = module.require('discord.js');
const config = module.require('../../config.json');
module.exports.run = async (bot, msg, args) => {
    const m = await msg.channel.send('```Generating image...```');
    if (args[0]) {
        try {
            const breed = args.join('').trim().toLowerCase().split('|').reverse().join('/');
            await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`).then(async (body) => {
                if (!body || body.data.status != 'success') {
                    m.delete();
                    return require('../../util/errMsg.js').run(bot, msg, true, 'I broke! Please try again or contact the developer!');
                }
                const attach = await new Discord.MessageAttachment(body.data.message, body.data.message.split('/').pop());
                msg.channel.send(attach);
            });
            return m.delete();
        }
        catch (e) {
            console.log(e.stack);
            m.delete();
            return require('../../util/errMsg.js').run(bot, msg, true, `Could not find this dog breed,\nbe sure to seperate breeds and subreeds:\n\`\`\`${config.pref}dog [sub-breed] | [breed]${config.suff}\`\`\`\ne.g. \`\`\`${config.pref}dog English | Bulldog${config.suff}\`\`\``);
        }
    }
    await axios.get('https://dog.ceo/api/breeds/image/random').then(async (body) => {
        if (!body || body.data.status != 'success') {
            m.delete();
            return require('../../util/errMsg.js').run(bot, msg, true, 'I broke! Please try again or contact the developer!');
        }
        const attach = await new Discord.MessageAttachment(body.data.message, body.data.message.split('/').pop());
        msg.channel.send(attach);
    });
    return m.delete();
};
module.exports.help = {
    name: 'dog',
    category: 'Misc.',
    reqPerms: [],
    description: 'Posts a random image of a provided breed of dog.',
    usage: `${config.pref}dog${config.suff} || ${config.pref}dog [sub-breed] | [breed]${config.suff}`,
    aliases: ['puppy', 'doggo'],
};
