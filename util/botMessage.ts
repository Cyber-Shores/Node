import { Message, MessageEmbed } from "discord.js"

export class BotMessage {
    embed: MessageEmbed
    msg: Message
    sent: Message

    constructor(msg: Message, embed: Embed) {
        this.msg = msg
        this.embed = new MessageEmbed({
            ...defaultEmbed(this.msg),
            ...embed
        })
    }

    async send() {
        return this.sent = await this.msg.channel.send(this.embed)
    }

    /** Remove previous data, adds new data */
    async edit(embed: Embed) {
        if(!this.sent) {
            console.error("cannot edit a message that has not been sent. currently sending the message and then editing it")
            await this.send()
        }

        this.embed = new MessageEmbed({
            ...defaultEmbed(this.msg),
            ...embed
        })
        this.sent = await this.sent.edit(this.embed)
        return this.sent
    }

    /** Keeps old data, adds new data */
    async update(embed: Embed) {
        if(!this.sent) {
            console.error("cannot update a message that has not been sent. currently sending the message and then editing it")
            await this.send()
        }

        this.embed = new MessageEmbed({
            ...this.sent.embeds[0],
            ...defaultEmbed(this.msg),
            ...embed
        })

        this.sent = await this.sent.edit(this.embed)
        return this.sent
    }

    async error(msg?: Message, timeout = 20000, del = true) {
        this.embed.setColor("#ff0000")
        await this.send()
        if(del)
            this.sent.delete({timeout})
        msg?.delete({timeout})
    }

    static wrap(text: string, length = 50, padding = 0, paddingStart?: boolean) {
        let l = paddingStart ? padding : 0
        let t = paddingStart ? " ".repeat(padding) : ""
        for(let word of text.split(" "))
            if(l + word.length + 1 + padding > length) {
                if(word.length + 1 + padding > length) {
                    //console.log(l, length - l, word.length, length, word, word.substr(0,length - l - 1) + '-\n', word.substring(length - l))
                    t += word.substr(0,length - l - padding - 1) + '-\n' + " ".repeat(padding) + word.substring(length - l) + " "
                    l = length - l + padding + 1
                } else {
                    t += "\n" + " ".repeat(padding) + word + " "
                    l = word.length + 1
                }
            } else {
                t += word + " "
                l += word.length + 1
            }

        return t
    }
}

export const defaultEmbed = (msg: Message) => ({
    color: msg.member.displayHexColor,
    // author: {
    //     name: msg.member.displayName + "  •  # " + msg.content.split(" ")[1],
    //     //icon_url: msg.author.avatarURL()
    // },
    timestamp: new Date(),
    footer: {
        "text": msg.author.username,
        "icon_url": msg.author.displayAvatarURL()
    }
})

export interface Embed {
    color?: string | number,
    title?: string,
    url?: string,
    author?: {
        name?: string,
        icon_url?: string,
        url?: string
    },
    description?: string
    thumbnail?: {
        url: string
    },
    fields?: {
        name: string,
        value: string,
        inline?: boolean
    }[],
    image?: {
        url: string
    },
    timestamp?: Date | number,
    footer?: {
        text?: string,
        icon_url?: string
    }
}