const config = module.require("../../config.json");
const Discord = module.require('discord.js');
module.exports.run = async (client, msg, args) => {
    let user = msg.mentions.users.first()
    let member = msg.guild.member(user);
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    
    msg.delete()
    
    if(!user) return require('../../util/errMsg.js').run(bot, msg, true, "Please mention a user.");
    if(!msg.member.hasPermission("KICK_MEMBERS")) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    if(user.id === msg.author.id) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    if(member.roles.highest.position >= msg.member.roles.highest.position) return require('../../util/errMsg.js').run(bot, msg, false, `You cannot kick ${user.username} because they have higher roles than you`);
    
    if (member) {
        member
          .kick('test command line')
          .then(() => {
            let kickembed = new Discord.MessageEmbed()
            .setTitle('**The Boot**')
            .setDescription(`**${user.username}** Has Recieved The Boot`)
            .attachFiles('https://i.imgur.com/r42VJvZ.gif')
            .setColor(msg.member.displayHexColor)
            msg.channel.send(kickembed)
          });
}};

module.exports.help = {
    name: "kick",
    reqPerms: ['KICK_MEMBERS'],
    description: "Kicks a user",
    usage: `${config.pref}kick [user-mention]${config.suff}`,
    aliases: []
}