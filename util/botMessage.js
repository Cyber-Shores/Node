"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEmbed = exports.BotMessage = void 0;
const discord_js_1 = require("discord.js");
class BotMessage {
    constructor(msg, embed) {
        this.msg = msg;
        this.embed = new discord_js_1.MessageEmbed({
            ...exports.defaultEmbed(this.msg),
            ...embed
        });
    }
    async send() {
        return this.sent = await this.msg.channel.send(this.embed);
    }
    /** Remove previous data, adds new data */
    async edit(embed) {
        if (!this.sent) {
            console.error("cannot edit a message that has not been sent. currently sending the message and then editing it");
            await this.send();
        }
        this.embed = new discord_js_1.MessageEmbed({
            ...exports.defaultEmbed(this.msg),
            ...embed
        });
        this.sent = await this.sent.edit(this.embed);
        return this.sent;
    }
    /** Keeps old data, adds new data */
    async update(embed) {
        if (!this.sent) {
            console.error("cannot update a message that has not been sent. currently sending the message and then editing it");
            await this.send();
        }
        this.embed = new discord_js_1.MessageEmbed({
            ...this.sent.embeds[0],
            ...exports.defaultEmbed(this.msg),
            ...embed
        });
        this.sent = await this.sent.edit(this.embed);
        return this.sent;
    }
    async error(msg, timeout = 20000, del = true) {
        this.embed.setColor("#ff0000");
        await this.send();
        if (del)
            this.sent.delete({ timeout });
        msg?.delete({ timeout });
    }
    static wrap(text, length = 50, padding = 0, paddingStart) {
        let l = paddingStart ? padding : 0;
        let t = paddingStart ? " ".repeat(padding) : "";
        for (let word of text.split(" "))
            if (l + word.length + 1 + padding > length) {
                if (word.length + 1 + padding > length) {
                    //console.log(l, length - l, word.length, length, word, word.substr(0,length - l - 1) + '-\n', word.substring(length - l))
                    t += word.substr(0, length - l - padding - 1) + '-\n' + " ".repeat(padding) + word.substring(length - l) + " ";
                    l = length - l + padding + 1;
                }
                else {
                    t += "\n" + " ".repeat(padding) + word + " ";
                    l = word.length + 1;
                }
            }
            else {
                t += word + " ";
                l += word.length + 1;
            }
        return t;
    }
}
exports.BotMessage = BotMessage;
exports.defaultEmbed = (msg) => ({
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
});
