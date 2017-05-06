Ext.define('MlbApp.view.Teams', {
	extend: 'Ext.Panel',
	alias: 'widget.teams',
	title:'Team Stats',
	defaults: {
		padding: '10 10 10 10'
	},
//	autoscroll: true,
	items: [{
		html: '<h1 class="x-panel-header">Team Stats</h1>',
		border: false
	},{
		xtype: 'team_combobox'
	},{
		xtype: 'panel',
		title: 'Team History',
		alias: 'widget.teamhistorytitle',
		itemId: 'teamhistorytitle'
	},{
		xtype: 'teamhistorypanel'
	}]
});