
module.exports = function refreshMemoryStats(metrics, client) {
  client.info('memory', function (err, reply) {
    var redis_mem_bytes = reply.match(/[\n\r].*used_memory:\s*([^\n\r]*)/)[1];
    var redis_mem = (redis_mem_bytes / 1048576).toFixed(1) + 'MB';
    metrics.redisMem.set(redis_mem);

    var redis_mem_rss_bytes = reply.match(/[\n\r].*used_memory_rss:\s*([^\n\r]*)/)[1];
    var redis_mem_rss = (redis_mem_rss_bytes / 1048576).toFixed(1) + 'MB';
    metrics.redisMemRss.set(redis_mem_rss);
  })
};
