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
    'https': 'commonjs @vcd/https',
    'url': 'commonjs url',
    'buffer': 'commonjs buffer',
    'zlib': 'commonjs browserify-zlib',
    'assert': 'commonjs assert',
    'crypto': 'commonjs crypto-browserify',
    'path': 'commonjs path'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      'original-fs': false
    }
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