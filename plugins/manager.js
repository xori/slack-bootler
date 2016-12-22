const E = require('@slack/client').RTM_EVENTS;
const ROOMS = "rooms"

module.exports = function(engine) {
  let rooms = engine.brain(ROOMS) || {};
  let WebClient = require('@slack/client').WebClient;
  let web = new WebClient(engine.config.admintoken);
  engine.brain(ROOMS, rooms);

  engine.on(/.+/i, function(message, params, send) {
    rooms = engine.brain(ROOMS)
    let room = rooms[message.channel]
    if(!room) return; // we aren't managing this room

    if(room.indexOf(message.user) === -1) {
      web.chat.delete(message.ts, message.channel, { as_user: true },
        function(err, info) {
            if(err) console.log(err, info);
      });
    }
  });

  engine.respond(/free <#(\w+)\|\w+>/i, function (message, p, send) {
    rooms = engine.brain(ROOMS)
    delete rooms[p[1]]
    engine.brain(ROOMS, rooms)
    send("room unprotected.")
  });

  engine.respond(/protect <#(\w+)\|\w+>(?: allow )?([@><#|\w,\s]+)?$/i, function(message, p, send) {
    rooms = engine.brain(ROOMS)
    try {
      let channel = p[1]
      rooms[channel] = [];
      if(p[2]) {
        let users = p[2].replace(/and|or/gi, ',').split(',');
        users = users.map(user => user.replace(/[<@>]/g, '').trim())
        rooms[channel] = users
      }
      engine.brain(ROOMS, rooms);
      send(`${p[1]} is now protected.`);
    } catch (e) {
      console.error(e);
      send(`Problem protecting this channel.`);
    }
  });

}
