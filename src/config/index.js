const configCommon = require('./common.json');
const configEnv = require(`./${process.env.NODE_ENV}.json`);
const providerSocket = process.env.REACT_APP_PROVIDER_SOCKET;
const config = { ...configCommon, ...configEnv, ...(providerSocker && { PROVIDER_SOCKET: providerSocket }) };

export default config;
