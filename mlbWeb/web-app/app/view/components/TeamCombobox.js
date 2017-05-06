var teams = Ext.create('MlbApp.store.Teams',{});

Ext.define('components.TeamCombobox', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.team_combobox',
    fieldLabel: 'Choose a Team',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'abbr',
    listeners: {
    	'select':function(combo, records, eOpts){
    		var teamHistoryTitle = Ext.ComponentQuery.query('#teamhistorytitle')[0];
    		var teamhistorypanel = Ext.ComponentQuery.query('#teamhistorypanel')[0];
    		
    		teamHistoryTitle.setTitle(records[0].data.city + ' ' + records[0].data.name + ' - Recent Games');
    		teamhistorypanel.loadGames(records[0].data.abbr);
    	}
    },
    
    initComponent: function() {

    	var me = this;
    	this.store = teams;
    	this.callParent();
    }
});