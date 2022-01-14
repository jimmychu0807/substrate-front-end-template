module.exports = function override(config, env) {
  config.resolve = {
    fallback: {
      "stream": require.resolve("stream-browserify")
    }
  }
  config.target = 'node'
  return config;
}
