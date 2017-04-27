//Ext.Loader.setConfig({ enable: false});

Ext.application({
	name: 'MLB Application',
	appFolder: 'app',
//	controllers: ['Main'],
	init: function() 
	{
		var me = this;
		
		Ext.Ajax.request({
			url: MlbApp.common.Globals.root + "main/test",
			success: function(response) {
				var json = Ext.JSON.decode(response.responseText);
				MlbApp.common.Globals.name = json.person.name;
				me.launchApp();
			}
		})
	},
	launchApp: function() 
	{
		MlbApp.common.Globals.appInit(function(){
			Ext.create('MlbApp.view.Viewport', {width: 1000});
		});
	}
})