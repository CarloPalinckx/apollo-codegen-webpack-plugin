const { exec } = require('child_process');
const minimatch = require('minimatch');
const fs = require('fs');
const ora = require('ora');
const fetchSchema = require('./fetchSchema');
const genTypes = require('./genTypes');

class ApolloCodegenWebpackPlugin {
    constructor(options) {
        this.id = 'ApolloWebpackPlugin';
        this.options = options;
        this.prevTimestamps = {};
        this.schemaFetched = false;
    }

    hasChanged(compilation) {
        const { skipSSLValidation, localSchemaFile, ...options } = this.options;
        const timestamps = {};
        let hasChanged = compilation.fileTimestamps.size === 0; // initial compilation

        for (let file of compilation.fileTimestamps.keys()) {
            if (minimatch(file.replace(compilation.options.context, '.'), this.options.includes)) {
                timestamps[file] = compilation.fileTimestamps.get(file);
            }
        }

        for (let file in timestamps) {
            if (this.prevTimestamps[file] === undefined || this.prevTimestamps[file] === timestamps[file]) {
                hasChanged = true;
            }
        }

        this.prevTimestamps = timestamps;

        return hasChanged;
    }

    apply(compiler) {
        const run = compilation => {
            const hasChanged = this.hasChanged(compilation);
            let result;

            if (!hasChanged) return Promise.resolve();

            if (!this.schemaFetched) {
                return fetchSchema(this.options).then(() => {
                    this.schemaFetched = true;

                    return genTypes(this.options);
                });
            }

            return genTypes(this.options);

            return result;
        };

        compiler.hooks.beforeRun.tapPromise(this.id, run);
        compiler.hooks.watchRun.tapPromise(this.id, run);
    }
}

module.exports = ApolloCodegenWebpackPlugin;
