const fs = require('fs-extra');
const path = require('path');
const configPath = path.resolve('config.json');
let config = {};

try {
  fs.accessSync(configPath, fs.F_OK);
  config = fs.readJsonSync(configPath);
} catch (e) {
  console.log(configPath, e);
}

config.token = process.env.SLACK_TOKEN || config.token;
config.admintoken = process.env.SLACK_ADMINTOKEN || config.admintoken;
config.google_api = process.env.GOOGLE_API || config.google_api;
config.lcbo = process.env.LCBO_API || config.lcbo;
config.brain = process.env.SLACK_BRAIN || config.brain || "./brain";
config.wolfram = process.env.WOLFRAM || config.wolfram;
config.host = process.env.SLACK_HOSTNAME || config.host || "http://localhost:8000";
config.bootup = new Date();

module.exports = config;
