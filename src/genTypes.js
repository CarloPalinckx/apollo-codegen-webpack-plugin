const exec = require('./exec');

const genTypes = options => {
    const { critical, skipSSLValidation, ...restOptions } = options;
    const timestamps = {};

    const command = Object.keys(restOptions).reduce((acc, option) => {
        if (option === 'output') return acc;
        if (restOptions[option] === true) return `${acc} --${option}`;

        return `${acc} --${option}="${restOptions[option]}"`;
    }, `client:codegen ${restOptions.output ? restOptions.output : ''}`);

    return exec('Generating types', command).catch(() => {
        if (options.critical) {
            process.exit(1);
        }
    });
};

module.exports = genTypes;
