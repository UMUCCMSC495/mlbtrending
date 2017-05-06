Ext.define('MlbApp.model.Team', {
	extend: 'Ext.data.Model',
	fields: [
	    'id',
		{name:'abbr', type:'string'},
		{name:'city', type:'string'},
		{name:'name', type:'string'}
	]
});