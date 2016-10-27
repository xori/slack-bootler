const fs = require('fs-extra')
const config = require('./ConfigLoader')
const pack = require('../package.json');
const Slack = require("@slack/client").RtmClient;
const E = require('@slack/client').RTM_EVENTS;
const C = require('@slack/client').CLIENT_EVENTS;
const Engine = require('./Engine');

const bot = new Slack(config.token, {
  logLevel: 'warn',
  dataStore: new (require('@slack/client').MemoryDataStore)()
});
bot.start();

const engine = new Engine(bot);

bot.on(E.MESSAGE, function(message) {
  try {
    /*
    { type: 'message',
      channel: 'C2R4LE084',
      user: 'U2R37LWKV',
      text: 'hello',
      ts: '1476840860.000004',
      team: 'T2R4X14AH' }
    */
    if(message.is_ephemeral || message.hidden) return;

    engine.handle(message, bot);
  } catch (e) {
    let _channel = bot.dataStore.getChannelById(message.channel);
    console.log(`${(new Date).toISOString()}:${_channel ? _channel.name : "Unknown"}:${bot.dataStore.getUserById(message.user).name}> ${message.text}`);
    console.error("ERROR>>>", e, message);
    // bot.sendMessage("Whoa, had a hard time with that comment. Should probably add that as an [issue](https://github.com/xori/bootler/issues)", message.channel);
  }
});
