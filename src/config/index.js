const configCommon = require('./common.json');
const configEnv = require(`./${process.env.NODE_ENV}.json`);
const config = { ...configCommon, ...configEnv };

export default config;
