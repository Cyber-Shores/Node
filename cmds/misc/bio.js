const config = module.require('../../config.json');
const { MessageEmbed } = require('discord.js');
const Discord = module.require('discord.js');
const mongoose = require('mongoose');
const Bio = require('../../models/UserBio');
const { findOneAndUpdate } = require('../../models/UserBio');


module.exports.run = async (bot, msg, args) => {
    const user = msg.mentions.members.first()
    let strings = args.join(' ').split(`${args[0]} `)

    if(args[0] == 'set') {
        const req = await Bio.findOne({ id: msg.author.id });
        if(req) {

            await Bio.findOneAndUpdate({ id: msg.author.id }, { $set: { bio: `${strings[1]}`}}, { new: true});
            let updateembed = new Discord.MessageEmbed({
                title: `New Bio Set`,
                description: `Your new Bio is:\n${strings[1]}`,
                color: msg.member.displayHexColor,
            footer: {
                "text": msg.author.username,
                "icon_url": msg.author.displayAvatarURL()
            },
            timestamp: Date.now()
            });
            return msg.channel.send(updateembed)

        }else{

    const doc = new Bio({ id: msg.author.id, bio: strings[1]});
        await doc.save();

        let createdembed = new Discord.MessageEmbed({
            title: `New Bio Created`,
            description: `Your bio is:\n${strings}`,
            color: msg.member.displayHexColor,
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
        });

        return msg.channel.send(createdembed)
    };
}

    if(!args[0]) {
        const req = await Bio.findOne({ id: msg.author.id });

        let authorembed = new Discord.MessageEmbed({
            title: `${msg.author.tag} Bio`,
            description: `${req.bio}`,
            color: msg.member.displayHexColor,
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
        });
        return msg.channel.send(authorembed)
    }else if(user) {
        const req = await Bio.findOne({ id: user.user.id });

        let userembed = new Discord.MessageEmbed({
            title: `${user.user.tag} Bio`,
            description: `${req.bio}`,
            color: msg.member.displayHexColor,
        footer: {
            "text": msg.author.username,
            "icon_url": msg.author.displayAvatarURL()
        },
        timestamp: Date.now()
        });
        return msg.channel.send(userembed)
    }




}
module.exports.help = {
	name: 'bio',
	category: 'Tools',
	reqPerms: [],
	description: 'Set a custom bio or view another users!',
	usage: `${config.pref}bio set|user${config.suff}`,
	aliases: [],
};