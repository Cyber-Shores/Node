const Discord = module.require('discord.js')
const config = module.require("../../config.json");
const randomPuppy = require('random-puppy');
module.exports.run = async (client, msg, args) => {
    if(!args[0]) return msg.channel.send('Please provide a subreddit name')
    let m = await msg.channel.send("```Generating image...```");
    const randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    let subreddits = [
        'memes',
        'me_irl',
        'meirl',
        'dankmemes',
        'meme'
    ]

    let randomsubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

    if(!args[0]) args[0] = `${randomsubreddit}`

    randomPuppy(args[0])
    .then(url => {
        let embed = new Discord.MessageEmbed() 
        .setTitle(`Random Post From ${args[0]}`)
        .setImage(url) 
        .setColor(msg.author.displayHexColor)
        msg.channel.send(embed);
    })
    m.delete()
}

module.exports.help = {
    name: "reddit",
    reqPerms: [],
    description: "Gets a post from a subreddit",
    usage: `${config.pref}reddit [subreddit excluding r/]${config.suff}`,
    aliases: ['r/']
}