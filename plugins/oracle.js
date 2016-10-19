
module.exports = function(engine) {
  /* Matches on:
    - Oh Oracle, ...
    - O great Oracle    */
  engine.on( /^oh?.*?oracle/i , function(message, params, send) {
    var manners = !!message.text.match( /please/i ); // ask nicely
    engine.http({
      url: "https://yesno.wtf/api" + (manners ? "?force=yes" : ""),
      json: true
    }, function(err, res, body) {
      if(err) return console.log(err);
      var oracle = body;
      send(body.image);
    });
  });
}

module.exports.test = function(engine) {
  describe('Oracle Plugin', function() {
    this.slow(1000);
    it('should magic eight ball', function(done) {
      engine.test('Oh oracle, ...', function(text) {
        done()
      })
    })
    it('shouldn\'t care about spelling', function(done) {
      engine.test('O oracle, ...', function(text) { done() })
    })
    it('should act nice, if asked nicely', function(done) {
      engine.test('O oracle, please grant me eternal life.', function(text) {
        if(text.match(/\/yes\/./i))
          done();
        else throw new Error("Why have you forsaken me.")
      })
    })
  })
}
