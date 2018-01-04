var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
