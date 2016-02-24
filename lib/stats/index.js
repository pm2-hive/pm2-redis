var Probe = require('pmx').probe();

var refreshServerStats = require('./server');
var refreshClientStats = require('./clients');
var refreshMemoryStats = require('./memory');
var refreshDbStats = require('./db');
var refreshTotalKeys = require('./scan');

var metrics = {};

function initMetrics() {

  metrics.redisVersion = Probe.metric({
    name: 'Redis Version',
    value: 'N/A'
  });

  metrics.redisProcId = Probe.metric({
    name: 'Process Id',
    value: 'N/A'
  });

  metrics.redisTcp = Probe.metric({
    name: 'Redis tcp port',
    value: 'N/A'
  });

  metrics.redisClients = Probe.metric({
    name: 'Connected clients',
    value: 'N/A'
  });

  metrics.redisMem = Probe.metric({
    name: 'Used memory',
    value: 'N/A'
  });

  metrics.redisUptime = Probe.metric({
    name: 'Uptime',
    value: 'N/A'
  });

  metrics.redisMemRss = Probe.metric({
    name: 'Used memory rss',
    value: 'N/A'
  });

  metrics.redisCmdSec = Probe.metric({
    name: 'cmd/sec',
    value: 'N/A'
  });

  metrics.redisHitsSec = Probe.metric({
    name: 'hits/sec',
    value: 'N/A'
  });

  metrics.redisMissSec = Probe.metric({
    name: 'miss/sec',
    value: 'N/A'
  });

  metrics.redisExpSec = Probe.metric({
    name: 'exp/sec',
    value: 'N/A'
  });

  metrics.redisEvtSec = Probe.metric({
    name: 'evt/sec',
    value: 'N/A'
  });

  metrics.redisScan = Probe.metric({
    name: 'Total keys',
    value: 'N/A'
  });

}

// the stats that get captured once at the beginning
function setClientState(client) {
  metrics.redisTcp.set(client.server_info.tcp_port);
  metrics.redisProcId.set(client.server_info.process_id);
  metrics.redisVersion.set(client.server_info.redis_version);

  refreshServerStats(metrics, client);
  refreshClientStats(metrics, client);
  refreshMemoryStats(metrics, client);
}

var scanReady = true;

// periodic capture of stats
function refreshMetrics(client) {
  refreshDbStats(metrics, client);
  if (scanReady) {
    refreshTotalKeys(metrics, client);
  }
  // toggle the flag so that it should only run once every other
  // iterval as it is resource intensive to scan all the keys
  scanReady = !scanReady;
}

module.exports.init = function init(client, refresh_rate) {
  refresh_rate = refresh_rate || 1000; // ms
  initMetrics();

  // once client is ready then start loading the stats
  client.on('ready', function () {
    setClientState(client);
    setInterval(refreshMetrics.bind(this, client), refresh_rate);
    refreshMetrics(client);
  });

};
