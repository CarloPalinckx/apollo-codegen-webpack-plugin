const ApolloCodegenWebpackPlugin = require('./src');

module.exports = {
    mode: 'development',
    entry: './__fixtures__/apollo/index.js',
    plugins: [
        new ApolloCodegenWebpackPlugin({
            output: '__schema__',
            target: 'typescript',
            includes: './__fixtures__/apollo/**/query.js',
            endpoint: 'https://dog-graphql-api.glitch.me/graphql/',
        }),
    ],
};
