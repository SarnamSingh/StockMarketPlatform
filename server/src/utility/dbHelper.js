const tedious = require('tedious');
const tdsConnection = tedious.Connection;
const tdsTypes = tedious.TYPES;
const tdsRequest = tedious.Request;
const procedureMapping = require('./procedureMapping');

const dbConnectionConfiguration = {
    server: global.gEnvConfig.dbServer,
    authentication: {
        type: "default",
        options: {
            userName: global.gEnvConfig.dbLoginUser,
            password: global.gEnvConfig.dbLoginPassword,
            database: global.gEnvConfig.dbName
        }
    },
}

const output = [];
const sqlConnection = new tdsConnection(dbConnectionConfiguration);
sqlConnection.on('connect', (err) => {
    if (err) {
        console.log(`Error occurred while connection to server :${err}`);
    }
    else {
        console.log('SQL connecton established successfully.');
    }
});

const executeQuery = (inputObject, query, callback) => {

    const sqlRequest = new tdsRequest(query, (err, rowCount, rows) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, output);
        }

    });
    procedureMapping.get(query).forEach(element => {
        sqlRequest.addParameter(element.propColumn, getTediousType(element.type), getModelProperty(element.modelProperty, inputObject))
    });
    sqlRequest.on('row', (columns) => {
        if (columns) {
            const currentRow = new Object();
            columns.forEach((column) => {
                currentRow[column.metadata.colName] = column.value;
            });
            output.push(currentRow);
        }
    });
    sqlConnection.callProcedure(sqlRequest);
};

const getTediousType = (inputType) => {
    switch (inputType.toLowerCase()) {
        case "string":
            return tdsTypes.VarChar
            break;
        case "number":
            return tdsTypes.Int
            break;
        case "datetime":
            return tdsTypes.DateTime
        case "boolean":
            return tdsTypes.Bit

    }
};

const getModelProperty = (prop, inputObject) => {

    if (prop.indexOf('.' > 0)) {
        const props = prop.split('.');
        props.forEach(prop => {
            inputObject = inputObject[prop];
        });
        return inputObject;
    }
    else {
     let value = null;
        if (typeof inputObject[prop] === 'string' && inputObject[prop].length > 0){
            value = inputObject[prop];
        }
        if (typeof inputObject[prop] === 'number' && inputObject[prop] !== 0){
            value = inputObject[prop];
        }
        if (typeof inputObject[prop] === 'boolean'){
            value = inputObject[prop];
        }
        return value;
    }
};

module.exports = executeQuery;




