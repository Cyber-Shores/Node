const config = module.require("../../config.json");
const Discord = module.require('discord.js')
module.exports.run = async (client, msg, args) => {
    
    if(!args[0]) {
        args[0] = '3'
    }
    if(args[0] > 25 || args[0] < 3) return require('../../util/errMsg.js').run(bot, msg, true, "Please pick the amount of slots 3-25");

    const slotembed = new Discord.MessageEmbed()
    .setTitle('Slots!')
    .setDescription('--------------------------------')
    
    const WINARRAY = []

    for(var i=0;i<args[0];i++){
        
        let randomnumber = Math.floor(Math.random() * 20) + 1;

        if(randomnumber <= 5) {
            randomicon = '☢️'
            resultvar = 1
            // randomicon = '🃏'
        }
        if(randomnumber <= 10 && randomnumber >= 6) {
            randomicon = '🔰'
            resultvar = 2
            // randomicon = '🃏'
        }
        if(randomnumber <= 15 && randomnumber >= 11) {
            randomicon = '❌'
            resultvar = 3
            // randomicon = '🃏'
        }
        if(randomnumber <= 20 && randomnumber >= 16) {
            randomicon = '🃏'
            resultvar = 4
        }
        slotembed
        .addField(`Slot ${i + 1}`, `${randomicon}`, true)
        WINARRAY.push(resultvar)
      }
        
    let result = WINARRAY.every(function (e) {
        return e == WINARRAY[2]
    })

    if(result == true) {
        WINRESULT = 'win!'
        COLOR = '#23B200'
    }
    if(result == false) {
        WINRESULT = 'lose!'
        COLOR = '#FF0101'
    }
        slotembed
        .setDescription(`You... ${WINRESULT}`)
        .setColor(`${COLOR}`)

    msg.channel.send(slotembed)


    return console.log(`${msg.author.tag} used the slot command`)


}

module.exports.help = {
    name: "slots",
    reqPerms: [''],
    description: "Pull the lever and spin the slots. Are you feeling lucky?",
    usage: `${config.pref}}slots [3 - 25]${config.suff}`,
    aliases: ['']
}