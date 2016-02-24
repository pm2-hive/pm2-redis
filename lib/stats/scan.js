var toArray = require('stream-to-array');


module.exports = function refreshTotalKeys(metrics, client) {
  toArray(client.scan(), function (err, keyarr) {
    if (err) {
      throw err;
    }
    metrics.redisScan.set(keyarr.length);
  });
};
