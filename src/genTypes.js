const exec = require('./exec');

const genTypes = options => {
    const { skipSSLValidation, localSchemaFile, ...restOptions } = options;
    const timestamps = {};

    const command = Object.keys(restOptions).reduce((acc, option) => {
        if (option === 'output') return acc;
        if (restOptions[option] === true) return `${acc} --${option}`;

        return `${acc} --${option}="${restOptions[option]}"`;
    }, `client:codegen ${restOptions.output ? restOptions.output : ''}`);

    return exec('Generating types', command);
};

module.exports = genTypes;
