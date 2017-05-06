//Ext.Loader.setConfig({ enable: false});

Ext.application({
	name: 'MLB Application',
	appFolder: 'app',
//	controllers: ['Main'],
	init: function() 
	{
		var me = this;
        me.launchApp();
	},
	launchApp: function() 
	{
		MlbApp.common.Globals.appInit(function(){
			Ext.create('MlbApp.view.Viewport', {width: 1000});
		});
	}
})