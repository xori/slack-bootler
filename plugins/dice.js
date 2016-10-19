const R = require('roll');

module.exports = function(engine) {
  engine.on(/^roll (.+)$/i, function(message, params, send) {
    let ask = params[1].split(" ");
    let dice = new R();

    let result = "";
    let resultValue = 0;
    for(let i = 0; i < ask.length; i++ ) {
      let _ = ask[i].trim();
      if(dice.validate(_)) {
        result += _ + " ";
        resultValue += dice.roll(_).result;
      } else {
        return send(`${_} isn't in standard dice format.`)
      }
    }
    send(result += `=> ${resultValue}`);
  });
}

var assert = require('assert');
module.exports.test = function(engine) {
  describe('Dice Plugin', function() {

    it('should do simple evaluations', function(done) {
      engine.test('roll 3d16', function(text) {
        assert( /3d16 => \d+/.test(text) );
        done();
      });
    });

    it('should do complex evaluations', function(done) {
      engine.test('roll 3d16 4d20*2+5', function(text) {
        assert(/3d16 4d20\*2\+5 => \d+/.test(text), text);
        done();
      });
    });

    it('should respond appropriately to incorrect syntax', function(done) {
      engine.test('roll 3$16', function(text) {
        assert.equal(text, "3$16 isn't in standard dice format.");
        done();
      });
    })
  });
}
