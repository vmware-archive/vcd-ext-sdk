const path = require('path');

module.exports = {
  cache: true,
  mode: 'production',
  entry: {
    deploy: './src/DeployActions.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { configFile: 'tsconfig.webpack.json' }
      },
    ],
  },
  externals: {
    '@vcd/node-client': 'commonjs @vcd/node-client',
    '@vcd/file-system': 'commonjs @vcd/file-system'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      path: require.resolve("path-browserify"),
      assert: require.resolve("assert/"),
      util: false,
      url: false,
      crypto: false,
      zlib: false,
      events: false,
      stream: false,
      fs: false
    }
  },
  optimization: {
    usedExports: true,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};