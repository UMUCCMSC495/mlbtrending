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
    		url: MlbApp.common.Globals.root + "api/recentgames/" + abbr,
    		success: function(response)
    		{
    			var games = Ext.JSON.decode(response.responseText, true);
                    
                // Sort games
                games.sort(function(g1, g2) {
                    if (g1.gameDate < g2) {
                        return -1;
                    }
                    if (g1.gameDate > g2) {
                        return 1;
                    }
                    return 0;
                });
                games.reverse();
                // Sort innings
                Ext.each(games, function(game) {
                    game.innings.sort(function(i1, i2) {
                        return i1.inningNumber - i2.inningNumber;
                    });
                });

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
    				    	var html = '<table border=0 cellpadding=15 cellspacing=0 width="100%">';
    				    	
    				    	/**
    				    	 * Header: Start Rows
    				    	 */
    				    	var row1 = '<tr><th>&nbsp;</th>';
    				    	var row2 = '<tr><td align="left"><b>' + games[i].away.abbr + '</b></td>';
    				    	var row3 = '<tr><td align="left"><b>' + games[i].home.abbr + '</b></td>';
    				    	
    				    	//Header: dynamic number of innings
        				    for (var j=0; j < games[i].innings.length; j++)
    				    	{
    				    		row1 += '<th>' + (parseInt(j) + 1) + '</th>';
    				    		row2 += '<td align="center"><b>' + games[i].innings[j].awayRuns + '</b></td>';
    				    		row3 += '<td align="center"><b>' + games[i].innings[j].homeRuns + '</b></td>';
    				    	}
                            
                            // Ensure at least 9 innings
                            if (games[i].innings.length < 9) {
                                for (var j=games[i].innings.length; j < 9; j++) {
                                    row1 += '<th>' + (parseInt(j) + 1) + '</th>';
                                }
                                
                                var paddingColumns = 9 - games[i].innings.length;
                                
                                row2 += '<td colspan="' + paddingColumns + '"></td>';
                                row3 += '<td colspan="' + paddingColumns + '"></td>';
                            }
    				    	
    				    	//Header: Runs, Errors, Homeruns
    				    	row1 += '<th>R</th><th>E</th><th>HR</th></tr>';
    				    	row2 += '<td><b>' + games[i].awayRuns + '</b></td><td><b>' + games[i].awayErrors + '</b></td><td><b>' + games[i].awayHomeRuns + '</b></td></tr>';
    				    	row3 += '<td><b>' + games[i].homeRuns + '</b></td><td><b>' + games[i].homeErrors + '</b></td><td><b>' + games[i].homeHomeRuns + '</b></td></tr>';
    				    	
    				    	html += row1;
    				    	html += row2;
    				    	html += row3;
    				    	html += '</table>';
    				    	
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