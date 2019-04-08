const { exec } = require('child_process');
const minimatch = require('minimatch');
const fetch = require('node-fetch');
const fs = require('fs');

class ApolloCodegenWebpackPlugin {
    constructor(options) {
        this.id = 'ApolloWebpackPlugin';
        this.options = options;
        this.execCommand = this.execCommand.bind(this);
        this.genTypes = this.genTypes.bind(this);
        this.fetchSchema = this.fetchSchema.bind(this);
        this.prevTimestamps = {};
    }

    execCommand(command, message = '') {
        exec(`npx apollo@2.6.2 ${command}`, (error, stdout, stderr) => {
            if (error) {
                console.error(error);
            }

            if (stdout && stdout !== '') {
                console.log(`${stdout}${message}`);
            }

            if (stderr && stderr !== '') {
                console.error(stderr);
            }
        });
    }

    genTypes(compilation) {
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

        const command = Object.keys(options).reduce((acc, option) => {
            if (option === 'output') return acc;
            return `${acc} --${option}="${options[option]}"`;
        }, `client:codegen ${options.output ? options.output : ''}`);

        if (hasChanged) {
            console.log(`[${this.id}] Generating types`);
            this.execCommand(command, `[${this.id}] Types generated`);
        }
    }

    fetchSchema() {
        const { endpoint, localSchemaFile, config, header, tag, skipSSLValidation, key } = this.options;
        const command = ['service:download'];

        if (localSchemaFile) command.push(localSchemaFile);
        if (config) command.push(`-c=${config}`);
        if (header) command.push(`--header=${header}`);
        if (endpoint) command.push(`--endpoint=${endpoint}`);
        if (tag) command.push(`-t=${tag}`);
        if (skipSSLValidation) command.push(`--skipSSLValidation`);
        if (key) command.push(`--key=${key}`);

        console.log(`[${this.id}] Downloading schema`);
        this.execCommand(command.join(' '), `[${this.id}] Schema downloaded`);
    }

    apply(compiler) {
        compiler.hooks.afterPlugins.tap(this.id, this.fetchSchema);
        compiler.hooks.run.tap(this.id, this.genTypes);
        compiler.hooks.watchRun.tap(this.id, this.genTypes);
    }
}

module.exports = ApolloCodegenWebpackPlugin;
