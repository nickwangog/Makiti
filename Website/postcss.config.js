const postcssCssNext = require('postcss-cssnext');
const postcssImport = require('postcss-import');

//	plugins are applied from LAST to FIRST
module.exports = {
	plugins: [
		postcssImport,
		postcssCssNext
	]
}