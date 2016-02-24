var pmx = require('pmx');
var clientFactory = require('./lib/clientFactory');
var stats = require('./lib/stats');
var actions = require('./lib/actions');

pmx.initModule({

  pid: pmx.resolvePidPaths([
    '/var/run/redis/redis-server.pid',
    '/var/run/redis/redis.pid',
    '/var/run/redis-server.pid',
    '/var/run/redis.pid'
  ]),

  widget: {
    type: 'generic',
    logo: 'http://redis.io/images/redis-white.png',

    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme: ['#9F1414', '#591313', 'white', 'white'],

    el: {
      probes: true,
      actions: true
    },

    block: {
      actions: true,
      issues: true,
      meta: false,
      main_probes: ['Total keys', 'cmd/sec', 'hits/sec', 'miss/sec', 'evt/sec', 'exp/sec']
    }

    // Status
    // Green / Yellow / Red
  }
}, function (err, conf) {
  var refresh_rate = process.env.PM2_REDIS_REFRESH_RATE || conf.refresh_rate;

  var client = clientFactory.build(conf);
  stats.init(client, refresh_rate);
  actions.init();
});
