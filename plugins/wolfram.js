module.exports = function(engine) {
  let wolfram = new (require('node-wolfram'))(engine.config.wolfram);

  /**
   * me> wolf me intergrate dx = 2x + 5 + C
   * me> fact: Doctor Strange movie
   **/
  engine.on(/(?:wolf me|^facts?):?\s+(.+)[\?!\.]?/i, (m, p, send) => {
    engine.client.sendMessage(`wolfing: ${p[1]}...`, m.channel, (err, msg) => {
      if(err) throw err;

      wolfram.query(p[1], function(err, response) {
          if(err) throw err;
          let results = response.queryresult;

          if(results.$.success === "false") {
            msg.text = engine.random([
              "There are no stupid questions, but that is one.",
              "I got nothing.",
              "¯\\_(ツ)_/¯",
              "The universe is full of unanswered questions. This is now one of them",
              "42?"
            ]);
            engine.client.updateMessage(msg, ()=>{});
            console.log("wolfram: ", msg);
            return;
          }

          if(parseInt(results.$.numpods) < 2) {
            msg.text = `http://www.wolframalpha.com/input/?i=${p[1]}`;
            engine.client.updateMessage(msg, ()=>{});
            console.log("wolfram: ", msg);
            return;
          }
          //require('fs-extra').writeJsonSync('./output.json', results);
          msg.text = results.pod[0].subpod[0].plaintext[0];
          msg.opts = msg.opts || {}
          msg.opts.attachments = [{
            "fallback": results.pod[1].subpod[0].plaintext[0],
            "image_url": results.pod[1].subpod[0].img[0].$.src
          }]
          engine.client.updateMessage(msg, (e)=>{
            if(e) throw e;
            console.log("I wolfed!", msg);
          });
      });
    })
  })

}
