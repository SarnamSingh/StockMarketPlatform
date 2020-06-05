const _ = require('lodash');
const config = require ('./config.json');

const defaultConfig = config.development;
const environmentConfig = config[process.env.NODE_ENV];    
const currentConfig = _.merge( defaultConfig, environmentConfig);
global.gEnvConfig = currentConfig;


