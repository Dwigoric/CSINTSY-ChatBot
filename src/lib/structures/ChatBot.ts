import { SapphireClient } from '@sapphire/framework';
import { ClientOptions } from "discord.js";

export default class ChatBot extends SapphireClient {
    constructor(options: ClientOptions) {
        super(options);
    }
}
