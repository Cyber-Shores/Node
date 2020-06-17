const Discord = module.require("discord.js");
const config = module.require("../../config.json");
module.exports.run = async (bot, msg, args) => {
    let m =  await msg.channel.send("```Generating avatar...```");
    let attach;
    if(args[0]&&args[0].toLowerCase()=="server"){
        if(!msg.guild.iconURL()){
            m.delete();
            return require('../../util/errMsg.js').run(bot, msg, false, "This server does not have an icon");
        }
        attach = new Discord.MessageAttachment(msg.guild.iconURL(), "icon.png");
    }else{
        let user = msg.mentions.users.first() || msg.author;

        attach = new Discord.MessageAttachment(user.displayAvatarURL(), "avatar.png");
    }
    msg.channel.send(attach);
    m.delete();
}

module.exports.help = {
    name: "avatar",
    reqPerms: [],
    description: "Posts the avatar / icon of the message author, a provided user, or the server.",
    usage: `${config.pref}avatar${config.suff} \\|\\| ${config.pref}avatar [users tag]${config.suff} \\|\\| ${config.pref}avatar server${config.suff}`,
    aliases: ['icon', 'pfp', 'profilePic']
}