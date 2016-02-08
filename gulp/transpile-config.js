var config = require('../package').pdnUi;
var filterPath = prefix => {
    var trash = /\/+\s*$|^\s+|\s+$/g;
    return `${(prefix || '').replace(trash, '')}`;
};
['src', 'target'].forEach(pathType=> {
    config[pathType] = filterPath(config[pathType]);
});

var trash = /^\s*\/+|\/+\s*$|^\s+|\s+$/g;
config.deployModes = Object.keys(config.inEnv).map(item=>(item || '').replace(trash, ''));
config.basics = config.basics.map(basic=>(basic || '').replace(trash, ''));
config.targetPathFor = {};
config.deployModes.forEach(mode=> {
    config.targetPathFor[mode] = `${config.target}/${mode}`;
});
module.exports = config;

