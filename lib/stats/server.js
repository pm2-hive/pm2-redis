
module.exports = function refreshServerStats(metrics, client) {
  client.info('server', function (err, reply) {
    var redis_uptime_seconds = reply.match(/[\n\r].*uptime_in_seconds:\s*([^\n\r]*)/)[1];
    var redis_uptime_days = reply.match(/[\n\r].*uptime_in_days:\s*([^\n\r]*)/)[1] + ' days';
    var redis_uptime_hours = (redis_uptime_seconds / 3600).toFixed(1) + ' hours';
    if (redis_uptime_hours > 48)
      metrics.redisUptime.set(redis_uptime_days);
    else
      metrics.redisUptime.set(redis_uptime_hours);
  })
};
