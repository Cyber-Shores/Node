const Discord = module.require("discord.js");
const config = module.require("../../config.json");
const ms = module.require('ms')
module.exports.run = async (bot, msg, args) => {

    let USER = msg.mentions.members.first();
    if(!USER) return require('../../util/errMsg.js').run(bot, msg, true, "Please mention a user");
    let ROLE = msg.guild.roles.cache.find(r => r.name === "Muted")
    if(!ROLE){
        try {
            ROLE = await msg.guild.roles.create({
                data: {
                    name: 'Muted',
                    color: 'GREY'
                },
                reason: 'Because Muted Role Is Necessary For Command Usage',
            });
        } catch(e) {
            console.log(e.stack);
        }
        
    }
    msg.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(ROLE, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            CONNECT: false
        });
    });

    await USER.roles.add(ROLE)
    
    


}

module.exports.help = {
    name: "mute",
    reqPerms: ['ADMINISTRATOR'],
    description: "Mutes a specified user!",
    usage: `${config.pref}mute [user] [optional time]${config.suff}`,
    aliases: []
}