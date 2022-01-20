const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = function override(config, env) {
  config.resolve = {
    fallback: {
      stream: require.resolve('stream-browserify'),
    },
  }
  config.plugins.push(new NodePolyfillPlugin())
  return config
}
