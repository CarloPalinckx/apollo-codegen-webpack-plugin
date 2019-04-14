const ora = require('ora');
const cp = require('child_process');
const path = require('path');

const exec = (name, command) => {
    const spinner = ora(`[ApolloWebpackPlugin] ${name}\n`).start();
    const apollo = path.join(__dirname, '..', 'node_modules', '.bin', 'apollo');

    return new Promise((resolve, reject) => {
        cp.exec(`${apollo} ${command}`, (error, stdout, stderr) => {
            if (error) {
                spinner.fail();
                console.error(error);
                return reject();
            }

            if (stderr) {
                spinner.fail();
                console.error(stderr);
                return reject();
            }

            if (stdout) {
                console.log(stdout);
            }

            spinner.succeed();
            resolve();
        });
    });
};

module.exports = exec;
