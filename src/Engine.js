
module.exports = class Engine {
  constructor(client) {
    this.client = client;
    this.config = require('./ConfigLoader');
    this.brain = require('./Brain');

    this.plugins = [];
    this._plugins = require('./PluginLoader');
    for(let i = 0; i < this._plugins.length; i++) {
      this._plugins[i](this); // startup.
    }
    this.http = require('request');
  }

  react(message, emoji) {
    emoji = emoji.replace(/:/g, '');
    let packet = {
      channel: message.channel,
      timestamp: message.ts
    };
    this.client._chat.makeAPICall('reactions.add', { name: emoji }, packet)
  }

  ////
  // .on(/hello world$/i, function(message, capture, send){
  //   send('goodbye world.');
  // })
  // Upon anyone sending a message to a channel the bot is in, this will check
  // the regex given and if it matches, run the accompanying function.
  on(regex, callback) {
    this.plugins.push({regex, callback});
  }

  ////
  // Similar to the .on() property but will only be checked if the bot was
  // @mentioned by name.
  respond(regex, callback) {
    this.plugins.push({regex, callback, mention: true});
  }

  ////
  // What the Discord Client runs on recieving a message.
  handle(message, client) {
    let userid = client.activeUserId;
    let content = message.text;
    let mentioned = (new RegExp("<@"+ userid +">")).test(content);
    // if we're mentioned, remove our name for the minimal content
    let minimalContent = content
    let _messageExtract = new RegExp("^(?:[\w\s]+)?<@"+ userid +">\s*(.+)$");
    if(mentioned && (_messageExtract).test(content)){
      minimalContent = content.match(_messageExtract)[1].trim()
    }
    for(let i = 0; i < this.plugins.length; i++) {
      if(!mentioned && this.plugins[i].mention) continue;
      let capture = null;
      if(this.plugins[i].mention)
        capture = minimalContent.match(this.plugins[i].regex);
      else
        capture = content.trim().replace(new RegExp("<@"+ userid +">"), "@bot").match(this.plugins[i].regex);
      if(capture) {
        this.plugins[i].callback(message, capture, function(m) {
          client.sendMessage(m, message.channel, () => {
            let _channel = client.dataStore.getChannelById(message.channel);
            console.log(`${(new Date).toISOString()}:${_channel ? _channel.name : "unknown"}:bootler> ${m}`);
          });
        })
      }
    }
  }

  ////
  // For testing, runs the .handle() with an overridden Discord Client.
  test(str, callback, override) {
    this.handle(Object.assign({
      text: str.replace(/@bot/g, `<@${this.client.activeUserId}>`),
      user: 'jimmy'
    }, override || {}), {
      activeUserId: this.client.activeUserId,
      sendMessage: function(result) {
        callback(result);
      }
    });
  }

  // For reporting errors if they occur.
  report(err) {
    if(err) console.error(err);
  }
}
