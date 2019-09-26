const config_common = require("./common.json");
const config_env = require(`./${process.env.NODE_ENV}.json`);
const config = { ...config_common, ...config_env };

export default config;
