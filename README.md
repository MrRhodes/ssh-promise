ssh-promise
===========

[ssh-promise](https://github.com/antonosmond/ssh-promise) is a simple [when](https://www.npmjs.com/package/when) promise wrapper around [ssh2](https://www.npmjs.com/package/ssh2) for [node.js](http://nodejs.org/).


Usage
===============

#### Executing a single ssh command
```javascript
var Client = require('ssh-promise');

// The config passed to the Client constructor should match the config required by ssh2
var ssh = new Client({
  host: '192.168.100.100',
  username: 'ubuntu',
  privateKey: require('fs').readFileSync('/here/is/my/key')
});

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
**NOTE**: in order to execute multiple commands in a single session, the commands are added to a ['here document'](http://en.wikipedia.org/wiki/Here_document) and executed on the remote host using /bin/bash so bash must be available on the host machine.

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
