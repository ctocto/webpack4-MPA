const path = require('path');

module.exports = {
  dll: {
    enable: true,
    include: ['lodash']
  },
  commonVendors: ['./src/lib/common.js'],
  browserSupports: ['last 2 versions', 'iOS >= 7', 'Android >= 4.0'],
  alias: {
    "@": path.resolve(__dirname, 'src'),
  },
  proxy: {
    '/api': {
      target: 'http://localhost:7001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
};
