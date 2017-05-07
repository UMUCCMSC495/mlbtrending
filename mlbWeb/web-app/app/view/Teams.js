Ext.define('MlbApp.view.Teams', {
	extend: 'Ext.Panel',
	alias: 'widget.teams',
	title:'Team Stats',
	defaults: {
		padding: '10 10 10 10'
	},
	items: [{
		html: '<h1 class="x-panel-header">Team Stats</h1>',
		border: false
	},{
		xtype: 'team_combobox',
		listeners: {
	    	'select':function(combo, records, eOpts)
	    	{
	    		var teamStatsTitle = Ext.ComponentQuery.query('#teamstatstitle')[0];
	    		var teamStatsPanel = Ext.ComponentQuery.query('#teamstatspanel')[0];
	    		var teamHistoryTitle = Ext.ComponentQuery.query('#teamhistorytitle')[0];
	    		var teamhistorypanel = Ext.ComponentQuery.query('#teamhistorypanel')[0];
	    		
	    		teamStatsTitle.setTitle(records[0].data.city + ' ' + records[0].data.name + ' - Stats');
	    		teamStatsPanel.loadData(records[0].data.abbr);
	    		teamHistoryTitle.setTitle(records[0].data.city + ' ' + records[0].data.name + ' - Recent Games');
	    		teamhistorypanel.loadGames(records[0].data.abbr);
	    	}
	    }
	},{
		xtype: 'panel',
		title: 'Team Stats',
		alias: 'widget.teamstatstitle',
		itemId: 'teamstatstitle'
    },{
        xtype: 'teamstatspanel'
    },{
		xtype: 'panel',
		title: 'Team History',
		alias: 'widget.teamhistorytitle',
		itemId: 'teamhistorytitle'
	},{
		xtype: 'teamhistorypanel'
	}]
});