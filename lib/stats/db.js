
var redis_hits_sec = 0;
var redis_miss_sec = 0;
var redis_expi_sec = 0;
var redis_evi_sec = 0;

module.exports = function refreshDbStats(metrics, client) {

  client.info('stats', function (err, reply) {
    var redis_cmd_sec = parseInt(reply.match(/[\n\r].*instantaneous_ops_per_sec:\s*([^\n\r]*)/)[1]);
    metrics.redisCmdSec.set(redis_cmd_sec);

    var result_redis_hits_sec = 0;
    var prev_result_hits = redis_hits_sec;
    redis_hits_sec = reply.match(/[\n\r].*keyspace_hits:\s*([^\n\r]*)/)[1];
    if (prev_result_hits != redis_hits_sec) {
      result_redis_hits_sec = redis_hits_sec - prev_result_hits;
    }
    metrics.redisHitsSec.set(result_redis_hits_sec);

    var result_redis_miss_sec = 0;
    var prev_result_miss = redis_miss_sec;
    redis_miss_sec = reply.match(/[\n\r].*keyspace_misses:\s*([^\n\r]*)/)[1];
    if (prev_result_miss != redis_miss_sec) {
      result_redis_miss_sec = redis_miss_sec - prev_result_miss;
    }
    metrics.redisMissSec.set(result_redis_miss_sec);

    var result_redis_expi_sec = 0;
    var prev_result_expi = redis_expi_sec;
    redis_expi_sec = reply.match(/[\n\r].*expired_keys:\s*([^\n\r]*)/)[1];
    if (prev_result_expi != redis_expi_sec) {
      result_redis_expi_sec = redis_expi_sec - prev_result_expi;
    }
    metrics.redisExpSec.set(result_redis_expi_sec);

    var result_redis_evi_sec = 0;
    var prev_result_evi = redis_evi_sec;
    redis_evi_sec = reply.match(/[\n\r].*evicted_keys:\s*([^\n\r]*)/)[1];
    if (prev_result_evi != redis_evi_sec) {
      result_redis_evi_sec = redis_evi_sec - prev_result_evi;
    }
    metrics.redisEvtSec.set(result_redis_evi_sec);

  })
};
