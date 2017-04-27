Ext.define('MlbApp.view.Viewport', {
	extend: 'Ext.container.Viewport',
	layout: {
		type: 'vbox',
//		type: 'anchor',
		align: 'center',
		pack: 'start',
	},

	initComponent: function() 
	{
		var me = this;
		
		Ext.apply(this, {
			defaults: {
				width: 800
			},
			
		    items: [{
		    	xtype: 'panel',
		    	align: 'center',
		    	border: true,
		        html: '<h1 class="x-panel-header">Baseball Tracker</h1>'
		    },{
		        xtype: 'tabpanel',
		        activeTab: 0,
		        defaults: {
		        	height: 800
		        },
		        items: [{
		        	title: 'Home',
		        	xtype: 'container',
		            items: [{
		            	html: '<h1 class="x-panel-header">Home</h1>',
		            	border: false
		            },{
		            	xtype: 'panel',
		            	title: 'Today\'s Games',
		            	width: '90%',
		            	align: 'center'
//		            	items: [{
//		            		html: 'Last Updated 6 minutes ago',
//		            	},{
//		            		xtype: 'grid',
//		            		width: '50%',
//		            		height: 300
		            }]
		        },{
		            title: 'Team Stats',
		            html: '<h1 class="x-panel-header">Team Stats</h1>Team Stats tab\'s content. Others may be added dynamically'
		        },{
		            title: 'Plotter',
		            html: '<h1 class="x-panel-header">Plotter</h1>Plotter tab\'s content. Others may be added dynamically'
		        }]
		    }]
		});
		
		this.callParent();
	}
});