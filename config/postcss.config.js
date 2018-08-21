let browserSupports = require('../.webpackrc.json').browserSupports; 

browserSupports = browserSupports ? browserSupports : ['last 2 versions', 'iOS >= 7', 'Android >= 4.0'];

module.exports = {
	plugins: [
		require('autoprefixer')({
			browsers: browserSupports,
		}),
		// require('postcss-px2rem')({
		// 	remUnit: 100
		// })
	]
}