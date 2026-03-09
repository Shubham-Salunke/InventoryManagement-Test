const { createProxyMiddleware } = require("http-proxy-middleware");

const proxyMiddleware = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
  });

module.exports = proxyMiddleware;
