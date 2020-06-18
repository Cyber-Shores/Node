const { Client, MessageEmbed } = module.require('discord.js');
const config = module.require("../../config.json");
const axios = module.require('axios');
module.exports.run = async (bot, msg, args) => {
    if(!args[0]) return require('../../util/errMsg.js').run(bot, msg, true, "Please provide a location to search.");
    
    let m = await msg.channel.send("```Generating weather data...```");
    let str = "";
    let woeid;
    await axios.get(`https://www.metaweather.com/api/location/search/?query=${args.join(" ")}`).then(loc => {
        try{
            const locType = loc.data[0].location_type.toLowerCase();
            if(locType == 'city' || locType == 'region'){
                woeid = loc.data[0].woeid;
                str = `https://www.metaweather.com/api/location/${woeid}/`;
            }
        }catch(e){
            m.delete();
            return require('../../util/errMsg.js').run(bot, msg, true, `Please supply the name of a city.\n\n\`Not all citys are supported, if ${args.join(" ")} is a city, then it is not supported\`\n\nSupported cities: https://www.metaweather.com/map/`);
        }
    });
    
    
    await axios.get(str).then(weather => {
        function genIcon(){
            let state = weather.data.consolidated_weather[0].weather_state_abbr;
            switch(state){
                case'sn':
                return 'https://cdn3.iconfinder.com/data/icons/weather-line-set/24/icn-snowflake-512.png';
                case'sl':
                return 'https://cdn3.iconfinder.com/data/icons/weather-line-set/24/icn-snowflake-512.png';
                case'h':
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-hail-512.png';
                case't':
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-rain-128.png';
                case'hr':
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-rain-128.png';
                case'lr':
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-drizle-512.png';
                case's':
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-scattered-showers-512.png';
                case'hc': 
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-cloud-512.png';
                case'lc':
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-partly-cloudy-512.png';
                case'c':
                if(weather.data.time>weather.data.sun_rise && weather.data.time<weather.data.sun_set){
                    return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-sun-512.png';
                }else{
                    return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-moon-512.png';
                }
                default:
                return 'https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-scattered-showers-512.png';
            }
        }
        function calcTemp(){
            let locale = msg.guild.region.toLowerCase();
            if(locale == "us-central" || locale == "us-east" || locale == "us-west" || locale == "us-south"){
                if(Math.floor(weather.data.consolidated_weather[0].min_temp) == Math.floor(weather.data.consolidated_weather[0].max_temp)){
                    return `${(Math.floor(weather.data.consolidated_weather[0].the_temp*(9/5)+32))}°F`;
                }
                return `${Math.floor(weather.data.consolidated_weather[0].min_temp*(9/5)+32)}° - ${Math.floor(weather.data.consolidated_weather[0].max_temp*(9/5)+32)}°F`;
            }else{
                if(Math.floor(weather.data.consolidated_weather[0].min_temp) == Math.floor(weather.data.consolidated_weather[0].max_temp)){
                    return `${Math.floor(weather.data.consolidated_weather[0].the_temp)}°C`;
                }
                return `${Math.floor(weather.data.consolidated_weather[0].min_temp)}° - ${Math.floor(weather.data.consolidated_weather[0].max_temp)}°C`;
            }
    
        }
        function calcWind(){
            let locale = msg.guild.region.toLowerCase(); 
            if(locale == "us-central" || locale == "us-east" || locale == "us-west" || locale == "us-south"){
                return `${Math.floor(weather.data.consolidated_weather[0].wind_speed)} mph`;
            }else{
                return `${Math.floor(weather.data.consolidated_weather[0].wind_speed*1.609)} kph`;
            }
    
        }
        function calcVis(){
            let locale = msg.guild.region.toLowerCase(); 
            if(locale == "us-central" || locale == "us-east" || locale == "us-west" || locale == "us-south"){
                return `${Math.floor(weather.data.consolidated_weather[0].wind_speed)} miles`;
            }else{
                return `${Math.floor(weather.data.consolidated_weather[0].wind_speed*1.609)} km`;
            }
    
        }
        let embed = new MessageEmbed()
            // .setAuthor(weather.data.latt_long, "",`https://www.google.com/maps/@${weather.data.latt_long.split(",")[0]},${weather.data.latt_long.split(",")[1]},17z`)
            .setTitle(weather.data.title || args.slice(1).join(" "))
            .setColor(msg.member.displayHexColor)
            .setThumbnail(genIcon())
            .setURL(`https://www.metaweather.com/${woeid}/` || str)
            .setDescription(weather.data.consolidated_weather[0].applicable_date || weather.data.time || "Today")
            .addFields(
                { name: "Temperature", value: calcTemp(), inline: true },
                { name: "Weather", value: weather.data.consolidated_weather[0].weather_state_name, inline: true },
                { name: "Humidity", value: `${weather.data.consolidated_weather[0].humidity}%`, inline: true },
                { name: "Wind Speed", value: calcWind(), inline: true},
                { name: "Wind Direction", value: weather.data.consolidated_weather[0].wind_direction_compass, inline: true },
                { name: "Visibility", value: calcVis(), inline: true }
            )
            .setFooter(`Certainty: ${weather.data.consolidated_weather[0].predictability}%`, msg.author.displayAvatarURL(), `https://www.google.com/maps/@${weather.data.latt_long.split(",")[0]},${weather.data.latt_long.split(",")[1]},17z`)
            .setTimestamp();
        msg.channel.send(embed);
    });
    m.delete();
}

module.exports.help = {
    name: "weather",
    reqPerms: [],
    description: "Posts an info box about the weather conditions of a provided city. (WIP)",
    usage: `${config.pref}weather [location]${config.suff}` /*|| ${config.pref}weather [lat] [long]${config.suff}`*/,
    aliases: ['w', 'temperature', 'temp', 'conditions']
}
// "https://cdn4.iconfinder.com/data/icons/weather-line-set/24/icn-weather-scattered-showers-512.png"