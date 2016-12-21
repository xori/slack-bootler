const E = require('@slack/client').RTM_EVENTS;
const ROOMS = "rooms"

module.exports = function(engine) {
  let rooms = engine.brain(ROOMS) || {};
  let WebClient = require('@slack/client').WebClient;
  let web = new WebClient(engine.config.token);
  engine.brain(ROOMS, rooms);

  engine.on(/./i, function(message, params, send) {
    console.log(message);
    rooms = engine.brain(ROOMS)

    let room = rooms[message.channel]
    if(!room) return; // we aren't managing this room

    if(room.indexOf(message.user) === -1) {
      console.log("deleting")
      web.chat.delete(message.ts, message.channel, { as_user: true },
        function(err, info) {
            console.log(err, info);
      });
    }
  });

}
