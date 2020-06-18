const { Client, MessageEmbed } = module.require('discord.js');
const config = module.require("../../config.json");
module.exports.run = async (bot, msg, args) => {
    function calcDate(date1,date2) {
        var diff = Math.floor(date1.getTime() - date2.getTime());
        var day = 1000 * 60 * 60 * 24;
        var message = "";
        var days = Math.floor(diff/day);
        if(days<31){
            return days + " days ";
        }
        var months = Math.floor(days/31);
        if(months<12){
            var daysLeft = days-months*31;
            message+= months + " months and ";
            message+= daysLeft + " days ";
            return message;
        }
        var years = Math.floor(months/12);
        var monthsLeft = months - years*12;
        var daysLeft = days-months*31;
        message+=years+" years, ";
        message+=monthsLeft+" months and ";
        message+=daysLeft+" days ";
        return message;
    }
    if(args[0] && args[0] == 'server'){
        function calcActivity(){
            let presenceArr = [];
            
            // from  u/flyerzrule with my modifications
            msg.guild.presences.cache.array().forEach(r => {
                if (r.activities.length > 0) {
                    if(r.activities[0].name != 'Custom Status' && !r.user.bot ){
                        presenceArr.push(r.activities[0].name);
                    }
                    
                }
            });
            // from u/flyerzrule ^

            let finArr = [];
            var used = false;
            for(var i=0;i<presenceArr.length;i++){
                for(var k=0;k<finArr.length;k++){
                    if(finArr[k]==presenceArr[i]){
                        used = true;
                    }
                }
                if(!used){
                    finArr.push(presenceArr[i]);
                    used = false;
                }
            }
            if(finArr.length==0){
                return 'N/A';
            }
            var max = 0;
            let top = finArr[0];
            for(var i = 0;i<finArr.length;i++){
                var count = 0;
                for(var k =0;k<presenceArr.length;k++){
                    if(presenceArr[k]==finArr[i]){
                        count++;
                    }
                }
                if(count>=max){
                    max=count;
                    top = finArr[i];
                }
            }
            return top;
        }
        function roleList(){
            let roleMsg = msg.guild.roles.cache.array().length +': '+msg.guild.roles.cache.array().join(' ');
            if(roleMsg.length > 1024){
                let roles = msg.guild.roles.cache.array();
                var count = 0;
                roleMsg = msg.guild.roles.cache.array().length+': ';
                roles.forEach(r => {
                    if(r.mentionable){
                        roleMsg += r+' ';
                    }
                });
            }
            return roleMsg;
        }
        past = msg.guild.createdAt; 
        const creation = calcDate(new Date(),past);
        const server = msg.guild;
        
        let embed = new MessageEmbed({
            color: msg.member.displayHexColor,
            author: { name: server.name },
            thumbnail: {
                url: server.iconURL()
            },
            fields: [
                {
                    name: '📑 General',
                    value: `\`\`\`MIPS\nID:\n${server.id}\nCreated:\n${creation} ago\nOwner:\n${msg.guild.owner.user.tag}\nRegion:\n${msg.guild.region}\`\`\``,
                    inline: true
                },
                {
                    name: '<:clnklist1:720049449023307787> Channels',
                    value: `\`\`\`javascript\nText: ${server.channels.cache.filter(channel => channel.type == 'text').size}\nVoice: ${server.channels.cache.filter(channel => channel.type == 'voice').size}\nStore: ${server.channels.cache.filter(channel => channel.type == 'store').size}\nNews: ${server.channels.cache.filter(channel => channel.type == 'news').size}\n\nCategories: ${server.channels.cache.filter(channel => channel.type == 'category').size}\n\`\`\``,
                    inline: true
                },
                {
                    name: '📊 Statistics',
                    value: `\`\`\`javascript\nMembers: ${server.members.cache.size}\nHumans: ${server.members.cache.filter(member => !member.user.bot).size}\nBots: ${server.members.cache.filter(member => member.user.bot).size}\nRoles: ${server.roles.cache.size}\n\`\`\``,
                    inline: true
                },
                {
                    name: '😀 Emojis',
                    value: `\`\`\`javascript\nEmojis: ${server.emojis.cache.filter(emoji => !emoji.animated).size}\nAnimojis: ${server.emojis.cache.filter(emoji => emoji.animated).size}\n\`\`\``,
                    inline: true
                },
                {
                    name: '<:clnkboost:720057574631669851> Server Boosting',
                    value: `\`\`\`javascript\nTotal Boosts: ${server.premiumSubscriptionCount}\nServer Level: ${server.premiumTier}\n\`\`\``,
                    inline: true
                },
                {
                    name: '🕹️ Most Common Activity',
                    value: `\`\`\`${calcActivity()}\`\`\``,
                    inline:true
                }
            ],
            timestamp: new Date(),
            footer: {
                text: `${msg.author.username}`,
                icon_url: `${msg.author.displayAvatarURL()}`
            }
        });
        msg.channel.send(embed);
    }else{
        let user = msg.mentions.members.first();
        if(!user) user = msg.member;
    
        let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        let embed = new MessageEmbed({
            color: msg.member.displayHexColor,
            author: { name: user.user.name },
            thumbnail: {
                url: user.user.displayAvatarURL()
            },
            description: `User: `,
            fields: [
                {
                    name: "📑 General:",
                    value: `\`\`\`javascript\nID: ${user.user.id}\nTag: ${user.user.tag}\n\`\`\``,
                    inline: true
                },
                {
                    name: "Created:",
                    value: `\`\`\`javascript\n${calcDate(new Date(), user.user.createdAt)}ago\`\`\``,
                    inline: true
                },
                {
                    name: "Joined :",
                    value: `\`\`\`javascript\n${calcDate(new Date(), user.joinedAt)}ago\`\`\``,
                    inline: true,
                },
                {
                    name: "Status:",
                    value: `\`\`\`javascript\n${user.user.presence.status}\`\`\``,
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: {
                text: `${msg.author.username}`,
                icon_url: `${msg.author.displayAvatarURL()}`
            }
        });
        // let embed = new MessageEmbed()
        //     .setAuthor(user.user.username)
        //     .setDescription(`Info about ${user.user.username}`)
        //     .setColor(user.displayHexColor)
        //     .setThumbnail(user.user.displayAvatarURL())
        //     .addField("Full Username", user.user.tag)
        //     .addField("ID", user.id)
        //     .addField("Created On", user.user.createdAt);
        msg.channel.send(embed);
    }
}

module.exports.help = {
    name: "info",
    reqPerms: [],
    description: "Posts a list of information about either the message author, or a provided user.",
    usage: `${config.pref}info [users tag]${config.suff} \\|\\| ${config.pref}info [users tag]${config.suff} \\|\\| ${config.pref}info server${config.suff}`,
    aliases: []
}