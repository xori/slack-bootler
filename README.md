# bootler [![wercker status](https://app.wercker.com/status/3e11407d5a86d397f9a520f2df3297cb/s/master "wercker status")](https://app.wercker.com/project/bykey/3e11407d5a86d397f9a520f2df3297cb)

A slack bot, written in javascript.

## Adding Functionality
Create a new file in [`plugins`](https://github.com/xori/slack-bootler/tree/master/plugins)
that looks something like this:

```javascript
module.exports = function(engine) {
  engine.respond(/hello world/i, function(message, params, send) {
    send("hello world!")
  })
}
```

then talk to `@bootler` in Slack.

> Evan: Hey @bootler, hello world<br>
> Bootler: hello world!

or for something a bit more interesting

> Evan: @bootler roll 3d6+3<br>
> Bootler: 3d6+3 => 19

## Development

1. Fork
1. [Get a test TOKEN key](https://api.slack.com/)
  * copy `config.example.json` to `config.json` and add your token
1. `npm install; npm test; npm start`
1. `git checkout -b my-new-feature`
1. Work on your feature
1. Open a pull request
