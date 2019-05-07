# Apollo Codegen Webpack Plugin

This plugin helps you run the [apollo-tooling](https://github.com/apollographql/apollo-tooling#apollo-clientcodegen-output) module using webpack without having to wire them together in a single process or running the two processes manually. It also handles the extraction of a schema file for you to be used in apollo-cache's [IntrospectionFragmentMatcher](https://www.apollographql.com/docs/react/advanced/fragments#fragment-matcher) for instance. It does this by attaching into webpack compilation hooks.

### On startup this plugin will:
- Extract schema file from endpoint
- Do an initial codegen based on that schema.json on all the files that you target with the `included` option

### On a file change this plugin will:
- Generate types based on the schema.json for changed files that match the `included` option

## Installing 💾

```
npm i -D apollo-codegen-webpack-plugin
```
Or when using yarn:
```
yarn add -D apollo-codegen-webpack-plugin
```

## Usage 🕹

```js
// in your webpack.config.js

const ApolloCodegenWebpackPlugin = require('apollo-codegen-webpack-plugin');

module.exports = {
    // ... your config
    plugins: [
        // ... your other plugins
        new ApolloCodegenWebpackPlugin({
            // ... your options
        }),
    ],
}
```

## Options ⚙

This plugin passes your provided options in  apollo:codegen. For a list of supported options, see: https://github.com/apollographql/apollo-tooling#apollo-clientcodegen-output

> Note: the [OUTPUT] positional is supported by passing an 'output' option to this plugin

> Note: the localSchemaFile option is also used to determine where to place the generated schema file.

> Note: valueless flags can be used by giving them a value of true. examples: "addTypename: true", "outputFlat: true"

### Additional options

A additional options are also supported, these are:

#### `critical`
Type: `Boolean` - Default: `false`

When this option is set to true, the plugin will exit with exit code 1 when an error occurs when generating the types or downloading the schema. This is useful when you want to use this plugin to also check your queries on a production build.

#### `skipSSLValidation`
Type: `String`

This option maps to `service:download` option.
