const config = module.require("../../config.json");
const Discord = module.require('discord.js')
module.exports.run = async (client, msg, args) => {

    msg.delete()

    let channelmention =  msg.mentions.channels.first()

    //simple check for permissions and mention
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("```❌ You do not have the proper permissions.```");
    if(!channelmention) return msg.channel.send(`\`\`\`No Channel Was Mentioned\`\`\``)
    //the actual overwrite itself
    channelmention.overwritePermissions([
        {
            id: msg.guild.roles.everyone.id,
            allow: ['SEND_MESSAGES']
        }
    ]);
    //the rest of the command output if the overwrite gets run
    let strings = args.join(" ").split(channelmention);
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    
    let embed = new Discord.MessageEmbed()
    .setTitle(`#${channelmention.name}`)
    .setDescription(`Has been unlocked`)
    .setTimestamp()
    .setFooter(`msg id:${msg.id}`)
    .setColor(randomColor)
    msg.channel.send(embed)

    console.log(`${channelmention.name} Was unlocked by ${msg.author.tag}`)

}



module.exports.help = {
    name: "unlock",
    reqPerms: [],
    description: "Unlock a channel",
    usage: `${config.pref}unlock${config.suff} <channel mention>`,
    aliases: ['']
}