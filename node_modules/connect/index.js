
module.exports = process.env.CONNECT_COV
  ? require('./lib-cov/connect')
  : require('./lib/connect');