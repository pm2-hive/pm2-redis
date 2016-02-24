var redis = require('redis');
require('redis-scanstreams')(redis);

module.exports.build = function build(conf) {

  var options = {
    host: process.env.REDIS_HOST || conf.ip,
    port: process.env.REDIS_PORT || conf.port,
    auth_pass: process.env.REDIS_PASSWORD || conf.password || null
  };

  return redis.createClient(options);
};
