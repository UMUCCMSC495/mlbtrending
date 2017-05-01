var data = function(){
	Ext.Ajax.request({
		url: MlbApp.common.Globals.root + "api/games",
		success: function(response) {
			return JSON.encode(response.responseText);
		}
	})
};

Ext.define('MlbApp.view.Home', {
	extend: 'Ext.Container',
	alias: 'widget.home',
	title:'Home',
	width: 500,

	initComponent: function(){
		var me = this;

		this.items = [{
			html: '<h1 class="x-panel-header">Home</h1>',
			border: false
		},{
			xtype: 'panel',
			title: 'Today\'s Games',
			width: '90%',
			align: 'center'
		},{
			xtype: 'container',
			html: this.getGames()
		}]

		this.callParent();
	},

	getGames: function() {

		var tpl = new Ext.XTemplate(
				"<table border='1' style='width:100%'>",
				"<tr>",
				"<tpl>{[this.getHeaders(values)]}</tpl>",
				"<tpl>{[this.getRows(values)]}</tpl>",
				"</tr>",
				"</table>",
				{
					getHeaders: function (values) {
						var ret = '';

						Ext.each(values, function (item) {
							ret += '<th>' + item.home + '</th>';
						});

						return ret;
					},
					getRows: function (values) {
						var ret = '',
						rowsArr = [];

						Ext.each(values, function (item) {
							Ext.each(item.innings, function (cell, i) {
								rowsArr[i] = Ext.Array.from(rowsArr[i]);
								rowsArr[i].push('<td>' + cell + '</td>');
							});
						});

						Ext.each(values, function (item, i) {
							ret += '<tr>';
							ret += rowsArr[i].join('');
							ret += '</tr>';
						});

						return ret;
					}
				}
		);
	}
});