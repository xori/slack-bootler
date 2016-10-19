
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
      minimalContent = content.match(_messageExtract)[1]
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
            console.log(`${(new Date).toISOString()}:${client.dataStore.getChannelById(message.channel).name}:bootler> ${m}`);
          });
        })
      }
    }
  }

  ////
  // For testing, runs the .handle() with an overridden Discord Client.
  test(str, callback, override) {
    this.handle(Object.assign({
      text: str,
      user: `<@${this.client.activeUserId}>`
    }, override || {}), {
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
