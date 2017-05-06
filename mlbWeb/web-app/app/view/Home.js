Ext.define('MlbApp.view.Home', {
	extend: 'Ext.Panel',
	alias: 'widget.home',
	title:'Home',
	defaults: {
		padding: '10 10 10 10'
	},

	items: [{
		html: '<h1 class="x-panel-header">Home</h1>',
		border: false
	},{
		xtype: 'todaysgamespanel',
		margin: '0 0 20 0'
			
	},{
		xtype: 'yesterdaysgamespanel'
	}]
});