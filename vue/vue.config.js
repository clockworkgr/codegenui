const path = require('path')

module.exports = {
	configureWebpack: {
		devtool: 'source-map',
		resolve: {
			symlinks: false,
			alias: {
				vue$: path.resolve('./node_modules/vue/dist/vue.esm-bundler.js')
			}
		}
	}
}
