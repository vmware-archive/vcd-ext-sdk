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
    'fs': 'commonjs @vcd/file-system',
    '@vcd/node-client': 'commonjs @vcd/node-client',
    // 'stream': 'commonjs stream-browserify',
    // 'http': 'commonjs stream-http',
    'https': 'commonjs @vcd/https',
    'url': 'commonjs url',
    'buffer': 'commonjs buffer',
    // 'events': 'commonjs events',
    // 'util': 'commonjs util',
    'path': 'commonjs path'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    usedExports: true,
    innerGraph: true
  },
  output: {
    filename: '[name].js',
    library: 'DeployActions',
    libraryExport: 'DeployActions',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist'),
  },
};