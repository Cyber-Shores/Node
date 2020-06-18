const settings = module.require("../../config.json");
module.exports.run = async (client, msg, args) => {
    let user = msg.mentions.users.first()
    let member = msg.guild.member(user);
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    
    msg.delete()
    
    if(!user) return msg.channel.send(`\`\`\`No User Was Mentioned\`\`\``)
    if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send("```❌ You do not have the proper permissions.```");
    if(user.id === msg.author.id) return msg.channel.send("```❌ You cannot kick yourself```");
    if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.channel.send(`\`\`\`❌ You cannot kick ${user.username} because they have higher roles than you\`\`\``);
    
    if (member) {
        member
          .kick('test command line')
          .then(() => {
          
            msg.channel.send(`**${user.username}**\n has recieved the boot`);
          })

    console.log(`${msg.author.tag} Kicked ${user.tag}`)
}}

module.exports.help = {
    name: "kick",
    reqPerms: [],
    description: "Kicks a user",
    usage: `${settings.prefix}kick <usertag>`,
    aliases: ['']
}