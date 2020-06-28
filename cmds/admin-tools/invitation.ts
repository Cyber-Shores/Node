import {pref, suff} from "../../config.json"
import * as eM from "../../util/errMsg.js"
import { Client, Message, Permissions, MessageEmbed, BitField, PermissionString } from "discord.js"

export async function run (bot: Client, msg: Message, args) { // URL = https://discord.com/oauth2/authorize?client_id={CLIENID}&permissions={BITFIELD}&scope=bot
	if(args[0] == "permissions")
		return msg.channel.send(new MessageEmbed().setDescription("🚩 All the permission flags:\n\`\`\`" + Object.keys(Permissions.FLAGS).join("\n") + "\`\`\`").setTitle("Permissions").setColor(msg.member.displayHexColor).setFooter(msg.member.nickname || msg.author.username, msg.author.avatarURL()).setTimestamp())
	if(args[0] == "current")
		return msg.channel.send(new MessageEmbed().setDescription("🔓 Current Permissions:\n" + msg.guild.me.permissions.toArray().join("\n")).setTitle("Current Permissions").setColor(msg.member.displayHexColor).setFooter(msg.member.nickname || msg.author.username, msg.author.avatarURL()).setTimestamp())

	args = args.map(_ => _.replace(",", ""))
	let bF = msg.guild.me.permissions

	if(!args.every(_ => Permissions.FLAGS[_]))
		return eM.run(bot, msg, false, "One or more of the permissions that you sent weren't actually permissions.\n"+`try \`${pref}invite permissions${suff}\` to see all of the permissions`)
	else {
		if(!args.forEach(_ => bF = bF.add(_)) && bF.bitfield == msg.guild.me.permissions.bitfield)
			return msg.channel.send(new MessageEmbed().setDescription("This bot already has the permissions inputted currently (from roles or invite)").setTitle("Invitation").setColor(msg.member.displayHexColor).setFooter(msg.member.nickname || msg.author.username, msg.author.avatarURL()).setTimestamp())
		else 
			return msg.channel.send(new MessageEmbed().setDescription("Click the title!").setAuthor("Invitation",undefined,`https://discord.com/oauth2/authorize?client_id=${bot.user.id}&permissions=${bF.bitfield}&scope=bot`).setColor(msg.member.displayHexColor).setFooter(msg.member.nickname || msg.author.username, msg.author.avatarURL()).setTimestamp())
	}
}

export const help = {
	name: 'invitation',
	category: 'Admin Tools',
	reqPerms: [],
	description: 'Generates an invite link with perms',
	usage: `${pref}invite [permission1] [...]${suff}`,
	aliases: [],
}