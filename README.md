ssh-promise
===========

[ssh-promise](https://github.com/antonosmond/ssh-promise) is a simple [when](https://www.npmjs.com/package/when) promise wrapper around [ssh2](https://www.npmjs.com/package/ssh2) for [node.js](http://nodejs.org/).


Usage
===============

#### Executing a single ssh command

```javascript
var Client = require('ssh-promise');

// The config passed to the Client constructor should match the config required by ssh2
var config = {
  host: '192.168.100.100',
  username: 'ubuntu',
  privateKey: require('fs').readFileSync('/here/is/my/key')
}

// The Client constructor can also take an optional logger.
// This is any object which has both an info() and error() functions e.g. a bunyan logger.
// If a logger is not provided, console will be used.
var ssh = new Client(config, logger);

// Execute the command and once complete, the then function will be called
ssh.exec('mkdir test')
  .then(function() {
    // command has completed
  })
  .catch(function(err) {
    throw err;
  })
  .done();

```


#### Executing multiple ssh commands

```javascript
var Client = require('ssh-promise');

// The config passed to the Client constructor should match the config required by ssh2
var ssh = new Client({
  host: '192.168.100.100',
  username: 'ubuntu',
  privateKey: require('fs').readFileSync('/here/is/my/key')
});

commands = [
  'mkdir test',
  'echo "ssh-promise is awesome!" >> test/ssh.txt'
];

// Execute the commands and once all commands are complete, the then function will be called
ssh.exec(commands)
  .then(function() {
    // commands have completed
  })
  .catch(function(err) {
    throw err;
  })
  .done();

```
