Ext.define('MlbApp.view.Viewport', {
	extend: 'Ext.container.Viewport',
	layout: {
		type: 'vbox',
		align: 'center',
		pack: 'start',
	},
	autoScroll: true,
	autoShow: true,

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
		        	minHeight: 1000
		        },
		        items: [{
		            xtype: 'home'
		        },{
		            xtype: 'teams'
		        },{
		            xtype: 'plotter'
		        }]
		    }]
		});
		
		this.callParent();
	}
});