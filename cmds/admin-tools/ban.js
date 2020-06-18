const config = module.require("../../config.json");
const Discord = module.require('discord.js');
module.exports.run = async (client, msg, args, bot) => {
    let user = msg.mentions.users.first()
    let member = msg.guild.member(user);
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    
    msg.delete()


    if(!user) return require('../../util/errMsg.js').run(bot, msg, true, "Please mention a user");
    if(!msg.member.hasPermission("BAN_MEMBERS")) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    if(user.id === msg.author.id) return require('../../util/errMsg.js').run(bot, msg, false, "You cannot ban yourself.");
    if(member.roles.highest.position >= msg.member.roles.highest.position) return require('../../util/errMsg.js').run(bot, msg, false, `You cannot kick ${user.username} because they have higher roles than you.`);
    
    if (member) {
        member
          .ban('test command line')
          .then(() => {
            
            let banembed = new Discord.MessageEmbed()
            .setTitle('**Ban Hammer**')
            .setDescription(`The Ban Hammer Has Struck Down ${user.username}`)
            .attachFiles('https://i.imgur.com/r42VJvZ.gif')
            msg.channel.send(banembed)
          })

    console.log(`${msg.author.tag} Banned ${user.tag}`)
}}

module.exports.help = {
    name: "ban",
    reqPerms: ["BAN_MEMBERS"],
    description: "Bans a user",
    usage: `${config.pref}ban [user-mention]${config.suff}`,
    aliases: ['']
}