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
        this.prevTimestamps = {};
    }

    execCommand(command, message = '') {
        let commandWithFlags = command;

        commandWithFlags = Object.keys(this.options).reduce((acc, option) => {
            if (option === 'output') return `${acc} ${this.options[option]}`;

            return `${acc} --${option}=${this.options[option]}`;
        }, command);

        exec(`npx apollo@2.6.2 ${commandWithFlags} --color`, (error, stdout, stderr) => {
            if (error) {
                throw new Error(error);
                return;
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

        if (hasChanged) {
            console.log(`[${this.id}] Generating types`);
            this.execCommand('client:codegen', `[${this.id}] Types generated`);
        }
    }

    fetchFragments() {
        console.log(`[${this.id}] Generating fragment types`);

        const query = `
        {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `;

        fetch(this.options.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                variables: {},
                query: query,
            }),
        })
            .then(result => result.json())
            .then(result => {
                const filteredData = result.data.__schema.types.filter(type => type.possibleTypes !== null);

                result.data.__schema.types = filteredData;
                fs.writeFile('./fragmentTypes.json', JSON.stringify(result.data), err => {
                    if (err) {
                        console.error(`[${this.id}] Error writing fragmentTypes file`, err);
                    } else {
                        console.log(`[${this.id}] Fragment types successfully extracted`);
                    }
                });
            });
    }

    apply(compiler) {
        compiler.hooks.afterPlugins.tap(this.id, () => {
            this.fetchFragments();
        });
        compiler.hooks.run.tap(this.id, this.genTypes);
        compiler.hooks.watchRun.tap(this.id, this.genTypes);
    }
}

module.exports = ApolloCodegenWebpackPlugin;
