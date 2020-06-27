import { Client, Message } from "discord.js"

export function run(bot: Client, msg: Message, isWarn: boolean, text: string): Promise<void>
export interface help {
    name: "errMsg",
    description: "Generates an error message embed"
}