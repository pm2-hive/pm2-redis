var pmx = require('pmx');
var shelljs = require('shelljs');

module.exports.init = function init() {
  pmx.action('restart', function (reply) {
    var child = shelljs.exec('/etc/init.d/redis-server restart');
    return reply(child);
  });

  pmx.action('backup', function (reply) {
    var child = shelljs.exec('redis-cli bgsave');
    return reply(child);
  });

  pmx.action('upgrade', function (reply) {
    var child = shelljs.exec('/etc/init.d/redis-server restart');
    return reply(child);
  });

};
