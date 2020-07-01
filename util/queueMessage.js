"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.run = void 0;
const wait = require("./wait");
const botMessage_1 = require("./botMessage");
exports.run = class queueMessage {
    constructor(msg, instance, update, filler = false) {
        this.msg = msg;
        this.update = (queueMessage) => update(queueMessage);
        this.instance = () => instance();
        let previous = instance().filter(_ => _.msg.author.username == this.msg.author.username);
        if (previous.length > 2 && !filler) {
            new botMessage_1.BotMessage(msg, { title: "Stop Spamming :)", description: "If you keep on spamming, the delay will get longer and longer and messages with ❌ wont be processed and will be deleted" }).error(undefined, 5000, true);
            throw "too many message being send by " + msg.author.username;
        }
        this.last = previous[previous.length - 1];
        this.lifespan = this.getLifespan(previous.length) + (previous[previous.length - 1]?.lifespan || 0);
        console.log(this.secs(this.lifespan), this.secs(this.getLifespan(previous.length)), this.secs(previous[previous.length - 1]?.death - new Date().getTime() || 0), this.secs(previous[previous.length - 1]?.lifespan));
        this.death = new Date().getTime() + this.lifespan;
        this.delete();
    }
    async delete() {
        // console.log(`Added ${this.msg.content} by ${this.msg.author.username} at ${this.msg.createdTimestamp}. Lifespan is ${(this.lifespan / 1000).toFixed(3)}.`)
        await wait.run(this.lifespan);
        console.log(`Deleting ${this.msg.content} by ${this.msg.author.username} at ${this.msg.createdTimestamp} after ${parseInt(this.secs(this.lifespan)) - parseInt(this.secs(this.last?.lifespan || 0))} Death ${new Date(this.death).getMinutes()} : ${new Date(this.death).getSeconds()} Previous ${new Date(this.last?.death).getMinutes()} : ${new Date(this.last?.death).getSeconds()}`);
        this.update(this);
        console.log(this.instance().filter(_ => _.msg.author.username == this.msg.author.username).length);
    }
    getLifespan(count) {
        return (10 / (1 + (10 / .6) * Math.pow(Math.E, -.5 * count))) * 1000;
    }
    secs(ms) {
        return (ms / 1000).toFixed(3);
    }
    static delete(msg, timeout = 5000) {
        msg.delete({ timeout });
    }
};
exports.help = {
    name: "Message Queue",
    description: "Generates an suggestion message embed"
};
