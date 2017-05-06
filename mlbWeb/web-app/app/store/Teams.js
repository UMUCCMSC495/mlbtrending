Ext.define('MlbApp.store.Teams', {
	extend: 'Ext.data.Store',
	model: 'MlbApp.model.Team',
	proxy: {
		type: 'ajax',
		url: MlbApp.common.Globals.root + "api/teams",
		reader: {
	        type: 'json',
	        root: 'teams'
	    }
	},
	autoLoad: true
});