var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

var entries = getEntry('src/scripts/page/**/*.js', 'src/scripts/page/');
var chunks = Object.keys(entries);
var config = {
	entry: entries,
	output: {
		path: path.join(__dirname, 'public'),
		publicPath: '/static/',
		filename: 'scripts/[name].js',
		chunkFilename: 'scripts/[id].chunk.js?[chunkhash]'
	},
	module: {
		loaders: [ //加载器
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css')
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('css!less')
			}, {
				test: /\.html$/,
				loader: "html?-minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
			}, {
				test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
			}, {
				test: /\.(png|jpe?g|gif)$/,
				loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({ //加载jq
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new CommonsChunkPlugin({
			name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
			chunks: chunks,
			minChunks: chunks.length // 提取所有entry共同依赖的模块
		}),
		new ExtractTextPlugin('styles/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
		debug ? function() {} : new UglifyJsPlugin({ //压缩代码
			compress: {
				warnings: false
			},
			except: ['$super', '$', 'exports', 'require'], //排除关键字
			beautify : true
		}),
	]
};


var pages = Object.keys(getEntry('src/views/**/*.html', 'src/views/'));
pages.forEach(function(pathname) {
	var conf = {
		filename: '../views/' + pathname + '.html', //生成的html存放路径，相对于path
		template: 'src/views/' + pathname + '.html', //html模板路径
		inject: false //js插入的位置，true/'head'/'body'/false
	};
	if (pathname in config.entry) {
		if(pathname.match('.*common.*')){
			conf.inject = 'body';
			conf.chunks = ['vendors',pathname]; //将pathname和vendors模块的js引入到html中，并且将js放置在html内容下面		
			conf.hash = true;
		}else{
			conf.favicon = path.resolve(__dirname, 'src/imgs/logo.png');
			conf.chunks = [pathname]; //将pathname和vendors模块的js引入到html中，并且将js放置在html内容下面
			conf.inject = 'body';
			conf.hash = true;
		}
	}
	config.plugins.push(new HtmlWebpackPlugin(conf));
});


module.exports = config;

function getEntry(globPath, pathDir) {
	var files = glob.sync(globPath);
	var entries = {},
		entry, dirname, basename, pathname, extname;

	for (var i = 0; i < files.length; i++) {
		entry = files[i];
		dirname = path.dirname(entry);
		extname = path.extname(entry);
		basename = path.basename(entry, extname);
		pathname = path.normalize(path.join(dirname,  basename));
		pathDir = path.normalize(pathDir);
		if(pathname.startsWith(pathDir)){
			pathname = pathname.substring(pathDir.length)
		}
		entries[pathname] = ['./' + entry];
	}
	return entries;
}