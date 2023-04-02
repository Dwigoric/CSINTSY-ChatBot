import ChatBot from './lib/structures/ChatBot';
import config from './config';

require('dotenv').config();

const client = new ChatBot(config);

client.login(process.env.BOT_TOKEN);
