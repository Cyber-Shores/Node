const config = module.require("../../config.json");
const Discord = module.require('discord.js');
module.exports.run = async (client, msg, args) => {
    let num = 20;
    if(args[0]) num = args[0];
    const rolled = Math.floor(Math.random()*num)+1;
    let color = msg.member.displayHexColor;
    let rollMsg = `It rolled ${rolled}!`;
    const embed = new Discord.MessageEmbed({
        title: `* rolls a ${num} sided die *`,
        fields: [{ name: 'Result:', value: rollMsg }],
        color: color,
        thumbnail: {
            url: `https://weeknumber.net/gfx/200x200/${rolled}.png`,
        },
        timestamp: new Date(),
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`,
        },
    });
    msg.channel.send(embed);
}

module.exports.help = {
    name: "roll",
    reqPerms: [],
    description: "Returns a random number between 1 and a provided number. (20 by default)",
    usage: `${config.pref}roll${config.suff} || ${config.pref}roll [num]${config.suff}`,
    aliases: []
}