Ext.define('MlbApp.view.Plotter', {
	extend: 'Ext.Panel',
	alias: 'widget.plotter',
	title:'Plotter',
	defaults: {
		padding: '10 10 10 10'
	},
//	autoscroll: true,
	items: [{
		html: '<h1 class="x-panel-header">Plotter</h1>',
		border: false
	},{
		xtype: 'team_combobox',
		listeners: {
	    	'select':function(combo, records, eOpts)
	    	{
//	    		var teamHistoryTitle = Ext.ComponentQuery.query('#teamhistorytitle')[0];
//	    		var teamhistorypanel = Ext.ComponentQuery.query('#teamhistorypanel')[0];
//	    		
//	    		teamHistoryTitle.setTitle(records[0].data.city + ' ' + records[0].data.name + ' - Recent Games');
//	    		teamhistorypanel.loadGames(records[0].data.abbr);
	    	}
	    }
	},{
		xtype: 'panel',
		title: 'Team History',
		alias: 'widget.teamhistorytitle',
		itemId: 'teamhistorytitle'
	},{
		xtype: 'teamchart'
	}]
});