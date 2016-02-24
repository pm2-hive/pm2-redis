
var pmx     = require('pmx'),
    shelljs = require('shelljs'),
    fs      = require('fs'),
    path    = require('path'),
    redis   = require('redis');



var conf = pmx.initModule({

  pid    : pmx.resolvePidPaths(['/var/run/redis/redis-server.pid',
                                '/var/run/redis/redis.pid',
                                '/var/run/redis-server.pid',
                                '/var/run/redis.pid']),

  widget : {
    type : 'generic',
    logo : 'http://redis.io/images/redis-white.png',

    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme : ['#9F1414', '#591313', 'white', 'white'],

    el : {
      probes  : true,
      actions : true
    },

    block : {
      actions : true,
      issues  : true,
      meta    : false,
      main_probes : ['Total keys', 'cmd/sec', 'hits/sec', 'miss/sec', 'evt/sec', 'exp/sec']
    }

    // Status
    // Green / Yellow / Red
  }
}, function(err, conf) {

  var host = process.env.REDIS_HOST || conf.ip;
  var port = process.env.REDIS_PORT || conf.port;
  var password = process.env.REDIS_PASSWORD || conf.password;

  client = redis.createClient(port, host, {});

  if (password !== '')
    client.auth(password);

  var scan = require('./lib/scan'),
    versions = require('./lib/versions'),
    info = require('./lib/info');

  pmx.action('restart', function(reply) {
    var child = shelljs.exec('/etc/init.d/redis-server restart');
    return reply(child);
  });

  pmx.action('backup', function(reply) {
    var child = shelljs.exec('redis-cli bgsave');
    return reply(child);
  });

  pmx.action('upgrade', function(reply) {
    var child = shelljs.exec('/etc/init.d/redis-server restart');
    return reply(child);
  });
});
