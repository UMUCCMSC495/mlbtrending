Ext.define('MlbApp.view.Plotter', {
	extend: 'Ext.Panel',
	alias: 'widget.plotter',
	title:'Plotter',
	defaults: {
		padding: '10 10 10 10'
	},
	items: [{
		html: '<h1 class="x-panel-header">Plotter</h1>',
		border: false
	},{
		xtype: 'team_combobox',
		listeners: {
	    	'select':function(combo, records, eOpts)
	    	{
                var teamChart = Ext.ComponentQuery.query('#teamchart')[0];
                teamChart.plot(records[0].data.abbr);
	    	}
	    }
	},{
		xtype: 'panel',
		title: 'Plot',
		alias: 'widget.teamcharttitle',
		itemId: 'teamcharttitle'
	},{
		xtype: 'teamchart'
	}]
});