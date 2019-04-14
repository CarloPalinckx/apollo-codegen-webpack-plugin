const ora = require('ora');
const cp = require('child_process');

const exec = (name, command) => {
    const spinner = ora(`[ApolloWebpackPlugin] ${name}`).start();

    return new Promise((resolve, reject) => {
        cp.exec(`npx apollo@2.6.2 ${command}`, (error, stdout, stderr) => {
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
