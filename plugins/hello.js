const E = require('@slack/client').RTM_EVENTS;

module.exports = function(engine) {
  engine.on(/^(?:hello|hey|hi|yo)?\s?@bot[\s\.\?\!]*$/i, function(message, params, send) {
    send(engine.random(["Hey how are you doing?", "Hi!", "Hellooo"]));
  });

  const salutations = [
    "Good morning!",
    "Bad morning, it is not!",
    "A good morning, it is.",
    "Mornin' mi amigo!",
    "Top o' the mornin’ to ya!",
    "Rise and shine, it's time for wine!",
    "It *is* a good morning to be alive",
    "Hi, Handsome! How'd you sleep?",
    "Morning comes whether you set the alarm or not",
    "Mornin', good-lookin'!",
    "oh, Good Morning... I see the assassins have failed",
    "G'day mate!",
    "Top of the Morning or G'day or whatever you say down here",
    "Every day is a success if you give !!!MAXIMUM EFFORT!!!",
    "top o' the mornin' to ya laddies",
    "Rise and wine, it's time for *hic* Oh God"
  ]
  engine.on(/good morning,? (team|everyone)/i, (m, p, send) => {
    send(engine.random(salutations));
  });

  engine.on(/^(?:what is|who is|who's|whos)\s?@bot[\s\.\?\!]*$/i, function(message, params, send) {
    send("Hi, I'm a dumb bot! [Make me smarter](https://github.com/xori/bootler)");
  });

  engine.respond(/--version$/i, function(m, p, send) {
    let pack = require('../package.json');
    let d = engine.config.bootup;
    send(`v${pack.version} ${d.toISOString()}`);
  });

  engine.respond(/status(?: of)?\s?(.*)/i, function(m,p, send) {
    send("https://app.wercker.com/status/17dc81cf0b43f96f48934376ab884295/m/" + (p[1] === "" ? "master" : p[1]));
  });

  /**
   * This function forces bootler to emote to a past message. For example,
   * me> @bootler you forgot to 🍻 https://archive.slack/.../p1477510419000192
   */
  engine.respond(/:(.+):\s+<https:\/\/.+.slack.com\/archives\/(\w+)\/p(\d+)>/i, (m, p, send) => {
    let id, channel;
    // parse the timestamp and convert it to the messed up ts.
    try { id = (parseInt(p[3]) / 1000000).toFixed(6); }
    catch (e) { console.log(p); return; }

    // try and get the channel id and if you can't you probably already have it.
    try { channel = engine.client.dataStore.getChannelByName(p[2]).id; }
    catch (e) {
      channel = p[2]; // if direct message, this *should* never happen in reality.
    }

    console.log(`emoting: ${id} on ${channel} with a :${p[1]}:`);
    engine.react({ channel: channel, ts: id }, p[1]);
    send(engine.random(["my bad.", "fixed.", "whoops.", "I'll do that right now.", "thanks for reminding me."]));
  });

  engine.on(/:(hand|raised_hand_with_fingers_splayed|fist|open_hands|spock-hand|raised_hands):/, (m, p, send) => {
    engine.react(m, p[1]);
  });
}

module.exports.test = function(engine) {
  describe('Hello Plugin', function() {
    it('should say hi', function(done) {
      engine.test(`hi @bot`, function(text) { done() })
    })
    it('should respond to hey', function(done) {
      engine.test(`Hey @bot`, function(text) { done() })
    })
    it('should respond to confusion', function(done) {
      engine.test(`@bot?`, function(text) { done() })
    })
  })
}
