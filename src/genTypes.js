const exec = require('./exec');

const genTypes = options => {
    const { skipSSLValidation, localSchemaFile, critical, ...restOptions } = options;
    const timestamps = {};

    const command = Object.keys(restOptions).reduce((acc, option) => {
        if (option === 'output') return acc;
        if (restOptions[option] === true) return `${acc} --${option}`;

        return `${acc} --${option}="${restOptions[option]}"`;
    }, `client:codegen ${restOptions.output ? restOptions.output : ''}`);

    return exec('Generating types', command).catch(error => {
        console.error(error);
        if (options.critical) process.exit(1);
    });
};

module.exports = genTypes;
