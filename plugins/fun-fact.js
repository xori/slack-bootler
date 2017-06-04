module.exports = function(engine) {
  const feed = "https://www.reddit.com/r/showerthoughts.json?limit=100"
  const interval = 1000 * 60 * 60 * 36 // 36 hours

  function interestingThought() {
    return new Promise((res, rej) => {
      engine.http({
        url: feed,
        json: true
      }, function (error, response, body) {
        if(error) {
          return rej(error)
        }
        try {
          const obj = body
          const list = obj.data.children
          // sort idea by score, wisdom is timeless.
          list.sort((a,b) => b.data.score - a.data.score)
          // make sure our thought is unique
          let thoughts = engine.brain('thoughts') || []
          for(let i = 0; i < list.length; i++) {
            let item = list[i].data
            if(!thoughts.includes(item.id)) {
              thoughts.push(item.id)
              engine.brain('thoughts', thoughts)
              return res(item.title)
            }
          }
          rej("already used all these thoughts")
        } catch(e) {
          rej(e)
        }
      })
    })
  }

  engine.on(/good morning,? (team|everyone)/i, (m, p, send) => {
    interestingThought().then(thought => send(thought))
      .catch(e => console.error(e));
  });

  engine.on(/give me a thought/i, (m, p, send) => {
    interestingThought().then(thought => send(thought))
      .catch(e => console.error(e));
  });
}
