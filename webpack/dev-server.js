'use strict';
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const opn = require('opn');
const proxyMiddleware = require('http-proxy-middleware');

const config = require('../config')('development');
const webpackConfig = require('./webpack.dev.conf');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.dev.env.NODE_ENV;
}

// default port where dev server listens for incoming traffic
const port = process.env.port || config.dev.port;

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
});

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({
      action: 'reload',
    });

    cb();
  });
});

// proxy api requests
Object.keys(proxyTable).forEach((context) => {
  const options = proxyTable[context];

  if (typeof options === 'string') {
    options = {target: options};
  }

  app.use(proxyMiddleware(context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

const uri = 'http://localhost:' + port;

devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n'); // eslint-disable-line
});

module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err); // eslint-disable-line
    return;
  }

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri);
  }
});