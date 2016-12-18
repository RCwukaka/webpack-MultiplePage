//引入css
require("../../styles/lib/reset.css");
require("../../styles/common/global.css");
require("../../styles/common/grid.css");
require("../../styles/common/common.css");
require("../../styles/page/index.css");


//增加事件
$('.btn').click(function() {
	require(['../components/dialog/index.js'], function(dialog) {
		dialog();
	});
	require(['./common/header.js'],function(header){
		header();
	});
});