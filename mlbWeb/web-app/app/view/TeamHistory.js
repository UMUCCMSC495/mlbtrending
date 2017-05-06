Ext.define('MlbApp.view.TeamHistory', {
	extend: 'Ext.Panel',
	alias: 'widget.teamhistorypanel',
	itemId: 'teamhistorypanel',
	padding: '10 10 10 10',
	width: '100%',
	border: 0,
    
    loadGames: function(abbr) {
    	
    	var me = this;
    	
    	Ext.Ajax.request({
    		url: MlbApp.common.Globals.root + "api/recentgames",
    		params: {'abbr':abbr},
    		success: function(response)
    		{
    			var games = Ext.JSON.decode(response.responseText, true);
    			var teamhistorypanel = Ext.ComponentQuery.query('#teamhistorypanel')[0];
    			
    			teamhistorypanel.removeAll();
    			
    			for(var i=0; i<games.length; i++)
    			{
    				var panel = new Ext.panel.Panel({
    					title: me.renderTitle(games[i]),
    					padding: '10 10 10 10'
    				});
    				
    				var displayfield = new Ext.form.field.Display({
    					anchor: '100%',
    					renderer: function()
    					{
    						var innings = games[i].innings.length;
    				    	var html = '<table border=1 width="100%">';
    				    	
    				    	/**
    				    	 * Header: Start Rows
    				    	 */
    				    	var row1 = '<tr><th>&nbsp;</th>';
    				    	var row2 = '<tr><td align="center">' + games[i].away.abbr + '</td>';
    				    	var row3 = '<tr><td align="center">' + games[i].home.abbr + '</td>';
    				    	
    				    	//Header: dynamic number of innings
    				    	for (var j=0; j <= Math.max(9, games[i].innings.length); j++) 
    				    	{
    				    		row1 += '<th>' + (parseInt(j) + 1) + '</th>';
    				    		row2 += '<td>' + game[0].inning[j].awayRuns + '</td>';
    				    		row3 += '<td>' + game[0].inning[j].homeRuns + '</td>';
    				    	}
    				    	
    				    	//Header: Runs, Errors, Homeruns
    				    	row1 += '<th>R</th><th>E</th><th>HR</th></tr>';
    				    	row2 += '<td>' + game[i].awayRuns + '</td><td>' + game[i].awayErrors + '</td><td>' + game[i].awayHomeRuns + '</td></tr>';
    				    	row3 += '<td>' + game[i].homeRuns + '</td><td>' + game[i].homeErrors + '</td><td>' + game[i].homeHomeRuns + '</td></tr>';
    				    	
    				    	html += row1 + row2 + row3 + '</table>';
    				    	
    				    	return html;
    					}
    				})
    				
    				panel.add(displayfield);
    				panel.doLayout();
    				teamhistorypanel.add(panel);
    			}
    			teamhistorypanel.doLayout();
    		}
    	});
    },
    
    renderTitle: function(game)
    {
    	return game.away.abbr + ' @ ' + game.home.abbr;
    }
});