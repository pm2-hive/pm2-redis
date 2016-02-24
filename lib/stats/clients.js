
module.exports = function refreshClientStats(metrics, client) {
  client.info('clients', function (err, reply) {
    var connected_clients = reply.match(/[\n\r].*connected_clients:\s*([^\n\r]*)/)[1];
    metrics.redisClients.set(connected_clients);
  })
};
