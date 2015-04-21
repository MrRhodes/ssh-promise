var SSH2Client = require('ssh2').Client;
var when = require('when');
var sequence = require('when/sequence');

function Client(config, logger) {

  if (!(this instanceof Client)) {
    return new Client(config);
  }

  this.config = config;

  this.logger = logger || console;

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

  var config = this.config;
  var logger = this.logger;
  commandSequence = [];

  commands.forEach(function(cmd) {
    commandSequence.push(function() { return commandExecute(config, cmd, logger); });
  });

  sequence(commandSequence)
    .then(d.resolve)
    .catch(d.reject);

  return d.promise;

};

function commandExecute(config, command, logger) {

  var d = when.defer();

  var conn = new SSH2Client();

  conn.on('ready', function() {

    logger.info('Client :: ready');

    conn.exec(command, function(err, stream) {

      if (err) {
        logger.error(err);
        return d.reject(err);
      }

      stream.on('close', function(code, signal) {

        logger.info('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();

        if (code !== 0) {
          var err = new Error("SSH connection ended with non-zero exit code");
          logger.error(err);
          return d.reject(err);
        }

        return d.resolve();

      }).on('data', function(data) {
        logger.info('STDOUT: ' + data);

      }).stderr.on('data', function(data) {
        logger.error('STDERR: ' + data);
      });

    });
  }).connect(config);

  return d.promise;

}

module.exports = Client;
