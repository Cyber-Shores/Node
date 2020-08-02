const config = module.require('../../config.json');
const Discord = module.require('discord.js');
module.exports.run = async (bot, msg, args) => {
    const rolled = Math.floor(Math.random() * 101) + 1;
    const color = msg.member.displayHexColor;

    let headstail;
    if (rolled <= 50){
        headstail = `Heads`
    }else if(rolled > 50 && rolled < 101){
        headstail = `Tails`
    }else{
        headstail = `Landed on its side`
    }

	const embed = new Discord.MessageEmbed({
		title: `* Flips a two sided coin *`,
		fields: [{ name: 'Result:', value: headstail }],
		color: color,
		timestamp: new Date(),
		footer: {
			text: `${msg.author.username}`,
			icon_url: `${msg.author.displayAvatarURL()}`,
		},
    });
    
	msg.channel.send(embed);
};

module.exports.help = {
	name: 'flip',
	category: 'Gambling',
	reqPerms: [],
	description: 'Flips a coin',
	usage: `${config.pref}flip${config.suff}`,
	aliases: [],
};