const E = require('@slack/client').RTM_EVENTS;
const KarpIt = require('../test/card')

module.exports = function(engine) {
  let WebClient = require('@slack/client').WebClient;
  let web = new WebClient(engine.config.admintoken);
  let place = 'CKNKU6Q6N'
  let user = ['evan', 'aerim']

  web.channels.list().then((info) => {
    place = (info.channels.filter(c => c.name === 'magictcg')[0] || {id: ''}).id
    console.log(`Karping the ${place} channel.`)
  })
  web.users.list().then((info) => {
    user = (info.members.filter(u => user.indexOf(u.name) >= 0)[0] || {id: ''}).id
    console.log(`Karping user ${user}`)
  })

  engine.on(/.*/i, function(message, params, send) {
    if(message.channel === place && message.user === user
      && message.files && message.files.length > 0) {

        KarpIt(engine, message)
        .then(_ => {
          console.log("mtg card karp'd")
          web.chat.delete({
            channel: message.channel,
            ts: message.ts,
          })
          web.chat.postMessage({
            channel: message.channel,
            text: message.text,
            ts: message.ts,
            user: message.user,
            as_user: true,
            attachments: [{
              fallback: message.files[0].title,
              title: message.files[0].title,
              image_url: `${engine.config.host}/mtg/${message.ts}.gif`
            }]
          })
        })

    }
    console.log("GOTCHA", message)
  });

}
