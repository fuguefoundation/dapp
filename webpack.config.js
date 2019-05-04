// const nodeExternals = require('webpack-node-externals');
// externals: [nodeExternals()]
module.exports = {
  // "target": "node",
  node: {
    crypto: true,
    http: true,
    https: true,
    os: true,
    vm: true,
    stream: true
  },
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }]  
}
