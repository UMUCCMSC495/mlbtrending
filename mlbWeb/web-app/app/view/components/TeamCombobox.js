var teams = Ext.create('MlbApp.store.Teams',{});

Ext.define('components.TeamCombobox', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.team_combobox',
    fieldLabel: 'Choose a Team',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'abbr',
    
    initComponent: function() {

    	var me = this;
    	this.store = teams;
    	this.callParent();
    }
});