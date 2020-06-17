const config = module.require("../../config.json");
const { Menu } = module.require('discord.js-menu');
const {Client, MessageEmbed} = module.require("discord.js");
module.exports.run = async (bot, msg, args) => {
    // await msg.channel.send("```Awaiting...```");
    // const msgs = await msg.channel.awaitMessages(msg => msg.content.includes("hi"), {time: 5000});
    // msg.channel.send(`\`\`\`✅ Await completed! ${msgs.map(msg => msg.content).join(", ")}\`\`\``);
    
    let m = await msg.channel.send("Vote!");
    const agree = "✅";
    const disagree = "❌";
    m.react(agree);
    m.react(disagree);
    const reactions = await m.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 7000});
    let wait =  await msg.channel.send("```Generating results...```");
    let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    let embedMain = new MessageEmbed({
        title: "Ballot Box",
        description: "Heres how the vote went\n",
        color: randomColor
    });
    let embedYes = new MessageEmbed({
        title: `Who Voted     ${agree}`,
        color: 0x00d924
    });
    let embedNo = new MessageEmbed({
        title: `Who Voted     ${disagree}`,
        color: 0xdb0202
    });
    let total = new Array();
    reactions.forEach(reaction => {
        let people = reaction.users.cache.filter(u => u.id != "708803999838633985");
        people.forEach(p => {
            if(!total.includes(p.username)) total.push(p.username);
        })
    });
    if(total.length < 1) { 
        embedMain.setDescription("⚠️ No one voted");
    }else{
        embedMain.setDescription(total);
    }
    
    let yesVoters = new Array();
    let noVoters = new Array();
    await reactions.get(agree).users.cache.forEach(u => {
        if(u.id != "708803999838633985"){
            yesVoters.push(u.username);
        }
    });
    if(yesVoters.length<1) {
        embedYes.setDescription("No one voted");
    }else{
        embedYes.setDescription(yesVoters);
    }
    await reactions.get(disagree).users.cache.forEach(u => {
        if(u.id != "708803999838633985"){
            noVoters.push(u.username);
        }
   });
   if(noVoters.length<1) {
       embedNo.setDescription("No one voted");
   }else{
       embedNo.setDescription(noVoters);
   }
    new Menu(msg.channel, msg.author.id, [
        {
            name: "main",
            content: embedMain,
            reactions: {
                "⏹️": "stop",
                "✅": "yes",
                "❌": "no"
            }
        },
        {
            name: "yes",
            content: embedYes,
            reactions: {
                "⏹️": "stop",
                "❌": "no",
                "◀️": "main"
            }
        },
        {
            name: "no",
            content: embedNo,
            reactions: {
                "⏹️": "stop",
                "✅": "yes",
                "◀️": "main"
            }
        }
    ]);
    wait.delete();
    //msg.channel.send(`\`\`\`Voting complete! \n${agree}: ${reactions.get(agree).count-1}\n${disagree}: ${reactions.get(disagree).count-1}\`\`\``);
}

module.exports.help = {
    name: "vote",
    reqPerms: [],
    description: "Posts a ballot box that collects votes for '✅' or '❌', after a short amount of time, a menu will be provided detailing the results of the ballot.",
    usage: `${config.pref}vote${config.suff}`,
    aliases: ['v', 'ballot', 'ballotBox']
}