const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function addProxyMiddleware(app) {
  app.use(
    '/api/getSales',
    createProxyMiddleware({
      target: 'http://localhost:4003/getSales',
      changeOrigin: true,
    }),
  );
};