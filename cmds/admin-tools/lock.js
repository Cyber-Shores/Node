const config = module.require("../../config.json");
const Discord = module.require('discord.js');
module.exports.run = async (client, msg, args) => {

    msg.delete()

    let channelmention =  msg.mentions.channels.first()

    //simple check for permissions and mention
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return require('../../util/errMsg.js').run(bot, msg, false, "You do not have proper premissions.");
    if(!channelmention) return require('../../util/errMsg.js').run(bot, msg, true, "Please mention a channel");
    //the actual overwrite itself
    channelmention.overwritePermissions([
        {
            id: msg.guild.roles.everyone.id,
            deny: ['SEND_MESSAGES']
        }
    ]);
    //the rest of the command output if the overwrite gets run
    let strings = args.join(" ").split(channelmention)
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    
    let embed = new Discord.MessageEmbed()
    .setTitle(`#${channelmention.name}`)
    .setDescription(`Has been locked because: ${strings[1]}`)
    .setTimestamp()
    .setFooter(`msg id:${msg.id}`)
    .setColor(randomColor)
    msg.channel.send(embed)

    console.log(`${channelmention.name} Was locked by ${msg.author.tag}`)
    

}



module.exports.help = {
    name: "lock",
    reqPerms: [],
    description: "Locks a channel",
    usage: `${config.pref}lock${config.suff} <channel mention> <reason>`,
    aliases: ['']
}