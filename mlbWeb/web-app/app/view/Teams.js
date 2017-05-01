Ext.define('MlbApp.view.Teams', {
	extend: 'Ext.Panel',
	alias: 'widget.teams',
	title:'Team Stats',
	items: [{
		html: '<h1 class="x-panel-header">Team Stats</h1>',
		border: false
	},{
		xtype: 'panel',
		title: 'Select a Team',
		width: '90%',
		align: 'center'
	}]
});