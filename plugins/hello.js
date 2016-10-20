const E = require('@slack/client').RTM_EVENTS;

module.exports = function(engine) {
  engine.on( /^(?:hello|hey|hi|yo)?\s?@bot[\s\.\?\!]*$/i, function(message, params, send) {
    send("Hey how are you doing?");
  });

  engine.on( /^(?:what is|who is|who's|whos)\s?@bot[\s\.\?\!]*$/i, function(message, params, send) {
    send("Hi, I'm a dumb bot! [Make me smarter](https://github.com/xori/bootler)");
  });

  engine.respond( /--version$/i, function(m, p, send) {
    let pack = require('../package.json');
    let d = engine.config.bootup;
    send(`v${pack.version} ${d.toISOString()}`);
  });

  engine.respond(/status(?: of)?\s?(.*)/i, function(m,p, send) {
    send("https://app.wercker.com/status/3e11407d5a86d397f9a520f2df3297cb/m/" + p[1]);
  });

  engine.on( /:(hand|raised_hand_with_fingers_splayed|open_hands|spock-hand|raised_hands):/, (m, p, send) => {
    let packet = {
      channel: m.channel,
      type: E.REACTION_ADDED,
      timestamp: m.ts
    };
    engine.client._chat.makeAPICall('reactions.add', { name: p[1] }, packet)
  });
}

module.exports.test = function(engine) {
  var user = engine.activeUserId;
  describe('Hello Plugin', function() {
    it('should say hi', function(done) {
      engine.test(`hi <@${user}>`, function(text) { done() })
    })
    it('should respond to hey', function(done) {
      engine.test(`Hey <@${user}>`, function(text) { done() })
    })
    it('should respond to confusion', function(done) {
      engine.test(`<@${user}>?`, function(text) { done() })
    })
  })
}
