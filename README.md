
# MedDiagnose Bot

A Discord chatbot for diagnosing common illnesses in the Philippines. *It must be noted that any conclusion from this chatbot must **NOT** be treated as medical advice.*



## Prerequisites (for self-hosting only)
- [NodeJS](https://nodejs.org)
- [Discord Bot Token](https://discord.com/developers/applications)



## Installation

It is recommended to use the self-hosted instance of the bot instead of running it  yourself:

https://discord.com/api/oauth2/authorize?client_id=1091327462086029424&permissions=117824&scope=bot


### Self-hosting
To run the bot on your own machine:
1. Copy the `.env.example` file to `.env` and fill in the required fields.
    - The `BOT_TOKEN` field is the Discord bot token.
    - The `TEST_GUILD_ID` field is the ID of the Discord server where the bot will be tested.
    - The `BOT_OWNER_ID` field is the ID of the Discord user who will be the owner of the bot.
2. Go to the root directory and run on your terminal:
```bash
  $ npm install
  $ npm run build:start # For first-time usage
  $ npm run start # For succeeding usage
```
Rebuild the JavaScript files using `npm run build` if there are changes made to the source code.
