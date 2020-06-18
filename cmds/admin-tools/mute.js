const Discord = module.require("discord.js");
const config = module.require("../../config.json");
const ms = module.require('ms')
module.exports.run = async (bot, msg, args) => {

    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");

    let USER = msg.mentions.members.first();
    if(!USER) return require('../../util/errMsg.js').run(bot, msg, true, "Please mention a user");
    if(USER.id == msg.author.id) return require('../../util/errMsg.js').run(bot, msg, false, "You cannot mute youself!");
    if(USER.roles.highest.position >= msg.member.roles.highest.position) return require('../../util/errMsg.js').run(bot, msg, false, "Target user is of higher ranking then you!");
    let ROLE = msg.guild.roles.cache.find(r => r.name === "Node Muted")

    if(!ROLE){
        try {
            ROLE = await msg.guild.roles.create({
                data: {
                    name: 'Node Muted',
                    color: 'GREY'
                },
                reason: 'Because Muted Role Is Necessary For Command Usage',
            });
            msg.guild.channels.cache.forEach(async (channel, id) => {
                await channel.updateOverwrite(ROLE, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false
                });
            });
        } catch(e) {
            console.log(e.stack);
        }
    }
    if(USER.roles.cache.has(ROLE.id)) return require('../../util/errMsg.js').run(bot, msg, false, `${USER} is already muted!`);
    let succesembed = new Discord.MessageEmbed({
        title: `**Mute**`,
        description: `${USER} was succesfully muted!`,
        footer: {
            text: `${msg.author.username}`,
            icon_url: `${msg.author.displayAvatarURL()}`
        },
        timestamp: new Date(),
        color: (msg.member.displayHexColor)
    });
    if(!args[1]) {
        await USER.roles.add(ROLE)
        msg.channel.send(succesembed)
    }else{
        let role = msg.guild.roles.cache.find(r => r.name === "Muted");
        let time = args[0];
        await USER.roles.add(ROLE);

        msg.channel.send(succesembed);
        setTimeout(() => {
            if(!USER.roles.cache.has(ROLE.id)) return;
            console.log('Made it')
            USER.roles.remove(ROLE);
            let unmuteembed = new Discord.MessageEmbed({
                title: `**Unmute`,
                description: `${USER} has been unmuted!`,
                footer: {
                    text: `${msg.author.username}`,
                    icon_url: `${msg.author.displayAvatarURL()}`
                },
                timestamp: new Date(),
                color: (msg.member.displayHexColor)
            });
            msg.channel.send(unmuteembed);
        }, ms(time));
    }

}

module.exports.help = {
    name: "mute",
    reqPerms: ['ADMINISTRATOR'],
    description: "Mutes a specified user!",
    usage: `${config.pref}mute [optional-time] [user-mention]${config.suff}`,
    aliases: []
}