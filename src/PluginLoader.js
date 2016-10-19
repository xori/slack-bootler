var walkSync = require('walk-sync');

let plugins = [  ];

var paths = walkSync(__dirname + '/../plugins', { globs:["**/*.js"], directories: false })
for(let i = 0; i < paths.length; i++) {
    try {
      plugins.push(require(__dirname + '/../plugins/' + paths[i]));
      console.log("PLUGIN LOADED:", paths[i]);
    } catch (e) {
      console.error("PLUGIN ERROR:", paths[i], e);
    }
}

module.exports = plugins;
