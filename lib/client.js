var SSH2Client = require('ssh2').Client;
var when = require('when');

function Client(config) {
  if (!(this instanceof Client)) {
    return new Client(config);
  }
  this.config = config;
  return this;
}

Client.prototype.exec = function(commands) {

  var d = when.defer();

  if (!commands) {
    when.resolve();
  }

  if (commands.constructor !== Array) {
    commands = [commands];
  }

  var sshScript = '/bin/bash << EOF\n';
  commands.forEach(function(cmd) {
    sshScript += cmd + '\n';
  });
  sshScript += 'EOF';

  var conn = new SSH2Client();

  conn.on('ready', function() {

    console.log('Client :: ready');

    conn.exec(sshScript, function(err, stream) {

      if (err) {
        console.log(err);
        return d.reject(err);
      }

      stream.on('close', function(code, signal) {

        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();

        if (code !== 0) {
          var err = new Error("SSH connection ended with non-zero exit code");
          console.log(err);
          return d.reject(err);
        }

        return d.resolve();

      }).on('data', function(data) {
        console.log('STDOUT: ' + data);

      }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
      });

    });
  }).connect(this.config);

  return d.promise;

};

module.exports = Client;
