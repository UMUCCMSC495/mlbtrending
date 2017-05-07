Ext.define('MlbApp.view.TeamStats', {
	extend: 'Ext.Panel',
	alias: 'widget.teamstatspanel',
	itemId: 'teamstatspanel',
	padding: '10 10 10 10',
	width: '100%',
	border: 0,
    
    initComponent: function() {
        var me = this;

        me.items = [{
            xtype: 'panel',
            html: '<p>&nbsp;&nbsp;&nbsp;Select a team above.</p>'
        }];

        this.callParent();
    },

    loadData: function(abbr) {
    	
    	var me = this;
    	
    	Ext.Ajax.request({
    		url: MlbApp.common.Globals.root + "api/stats/" + abbr,
    		success: function(response)
    		{
    			var stats = Ext.JSON.decode(response.responseText, true);
    			var teamstatspanel = Ext.ComponentQuery.query('#teamstatspanel')[0];
    			
    			teamstatspanel.removeAll();
    			
                var panel = new Ext.panel.Panel({
                    title: 'Performance Summary',
                    padding: '10 10 10 10'
                });

                var displayfield = new Ext.form.field.Display({
                    anchor: '100%',
                    renderer: function()
                    {
                        var html = '<table border="0" cellpadding="15" cellspacing="0">'
                        
                        // Headers
                        html += '<tr>' +
                                    '<th align="center">Year</th>' +
                                    '<th align="center">Games Played</th>' +
                                    '<th align="center">Wins</th>' +
                                    '<th align="center">Losses</th>' +
                                    '<th align="center">Win Rate</th>' +
                                '</tr>';
                        
                        Ext.iterate(stats.data.years, function(year, data) {
                            html += '<tr>' +
                                        '<td align="center">' + year + '</td>' +
                                        '<td align="center">' + data.games + '</td>' +
                                        '<td align="center">' + data.wins + '</td>' +
                                        '<td align="center">' + data.losses + '</td>' +
                                        '<td align="center">' + (data.winrate * 100).toFixed(1) + '%</td>' +
                                    '</tr>';
                        });
                        
                        html += '</table>';

                        return html;
                    }
                });

                panel.add(displayfield);
                panel.doLayout();
                teamstatspanel.add(panel);
                
    			teamstatspanel.doLayout();
    		}
    	});
    }
});