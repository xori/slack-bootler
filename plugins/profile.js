const brain = require('../src/Brain');

function cleanKey(str) {
  var m = str.match(/<(?:.*)\|(.+)>/i);
  if(m) return m[1];
  else return str;
}


module.exports = function(engine) {
  let profiles = brain("profiles") || {};
  brain("profiles", profiles);

  engine.on(/set(?: my)? (.+) to (.+)$/i, (m, p, send) => {
    let profiles = brain("profiles");
    let user = profiles[m.user] || {};
    user[cleanKey(p[1])] = cleanKey(p[2]);
    profiles[m.user] = user;
    brain('profiles', profiles);
    send("done.");
  });

  engine.on(/remove my (.*)/i, (m, p, send) => {
    let profiles = brain("profiles");
    let user = profiles[m.user] || {};
    delete user[cleanKey(p[1])];
    profiles[m.user] = user;
    brain('profiles', profiles);
    send("done.");
  });

  engine.on(/show(?: me)? <@(\w+)>(?: profile)?/i, (m, p, send) => {
    const profiles = brain("profiles");
    const user = profiles[m.user] || {};
    const slackuser = engine.client.dataStore.getUserById(p[1]) || {};
    let result = `*${slackuser.profile.real_name || slackuser.name}*\n`;
    for(let key in user) {
      result += `${key}: ${user[key]}\n`;
    }
    send(result);
  });

  engine.on(/what(?:'s| is) <@(\w+)> (.+)/i, (m, p, send) => {
    const profiles = brain("profiles");
    const user = profiles[p[1]] || {};
    send(user[cleanKey(p[2])] || "I don't know.");
  });

  engine.on(/what(?:'s| is) my (.+)/i, (m, p, send) => {
    const profiles = brain("profiles");
    const user = profiles[m.user] || {};
    send(user[cleanKey(p[1])] || "I don't know.");
  });

}
