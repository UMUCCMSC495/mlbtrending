Ext.define('MlbApp.view.Viewport', {
	extend: 'Ext.container.Viewport',
	layout: {
		type: 'hbox',
		align: 'stretch',
		pack: 'center'
	},
	initComponent: function() 
	{
		var me = this;
		
		Ext.apply(this, {
			items: [{
				region: 'north',
				xtype: 'container',
				anchor: '100%',
				html: 'Hello World!'
		    }, {
		        region: 'west',
		        collapsible: true,
		        title: 'Navigation',
		        width: 150
		        // could use a TreePanel or AccordionLayout for navigational items
		    }, {
		        region: 'south',
		        title: 'South Panel',
		        collapsible: true,
		        html: 'Information goes here',
		        split: true,
		        height: 100,
		        minHeight: 100
		    }, {
		        region: 'east',
		        title: 'East Panel',
		        collapsible: true,
		        split: true,
		        width: 150
		    }, {
		        region: 'center',
		        xtype: 'tabpanel', // TabPanel itself has no title
		        activeTab: 0,      // First tab active by default
		        items: {
		            title: 'Default Tab',
		            html: 'The first tab\'s content. Others may be added dynamically'
		        }
		    }]
		});
		
		this.callParent();
	}
});