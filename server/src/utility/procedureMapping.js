const procedures = require('./procedures.json');

const procedureMapping = new Map();
for (const prop in procedures){
    procedureMapping.set(prop, procedures[prop])
}

module.exports = procedureMapping;

