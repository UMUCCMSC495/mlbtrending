var sort = {
    teamsByCity: function(team1, team2) {
        if (team1.city < team2.city) {
            return -1;
        }
        if (team1.city > team2.city) {
            return 1;
        }
        return 0;
    },
    
    games: function(game1, game2) {
        if (game1.gameDate < game2.gameDate) {
            return -1;
        }
        if (game1.gameDate > game2.gameDate) {
            return 1;
        }
        return 0;
    },
    
    innings: function(inning1, inning2) {
        return inning1.inningNumber - inning2.inningNumber;
    }
};

// Reusable components
var make = {
    teamAbbr: function(team) {
        return '<abbr title="' + team.city + ' ' + team.name + '">' +
                    team.abbr + '</abbr>';
    },
    
    teamLink: function(team) {
        return '<a href="#teams/' + team.abbr + '" ' +
               'title="' + team.city + ' ' + team.name + '">' +
                    team.abbr + '</a>';
    },
    
    teamSummary: function(team) {
        var $div = $('<div class="teamSummary"></div>');
        
        $div.append(team.name);
        
        return $div;
    },
    
    gameSummary: function(game, fullBoxScores) {
        if (typeof fullBoxScores === 'undefined') {
            withBoxScores = false;
        }
        
        var innings = Math.max(game.innings.length, 9);
        var columns = 5;
        
        if (fullBoxScores) {
            columns += innings;
            game.innings.sort(sort.innings);
            
            // Designate 'X' if bottom of 9th was not played
            if (game.homeRuns > game.awayRuns &&
                    innings.length === 9 &&
                    game.innings[8].awayRuns === 0) {
                game.innings[8].homeRuns = 'X';
            }
        }
        
        $table = $('<table class="scores"></table>')
                .append(
                    '<tr class="title">' +
                        '<th colspan="' + columns + '">' +
                            make.teamAbbr(game.away) + ' @ ' +
                            make.teamAbbr(game.home) + ': ' + game.status +
                        '</th>' +
                    '</tr>'
                );
        
        // Begins with blank column for team abbreviations in rows
        $headerRow = $('<tr><th></th></tr>');
        
        if (fullBoxScores) {
            for (var i = 0; i < innings; i++) {
                $headerRow.append('<th>' + (i + 1) + '</th>');
            }
        }
        
        $headerRow
                .append('<th><abbr title="Runs">R</abbr></th>' +
                        '<th><abbr title="Hits">H</abbr></th>' +
                        '<th><abbr title="Errors">E</abbr></th>' +
                        '<th><abbr title="Home Runs">HR</abbr></th>');
        
        $table.append($headerRow);
        
        $.each(['away', 'home'], function(index, team) {
            $teamRow = $('<tr></tr>')
                    .append('<td>' + make.teamLink(game[team]) + '</td>');
            
            if (fullBoxScores) {
                for (var i = 0; i < game.innings.length; i++) {
                    $teamRow.append('<td>' + game.innings[i][team + 'Runs'] + '</td>');
                }
                
                // Pad columns
                if (game.innings.length < innings) {
                    $teamRow.append('<td colspan="' + (innings - game.innings.length) + '"></td>');
                }
            }
            
            $teamRow.append('<td>' + game[team + 'Runs'] + '</td>' +
                            '<td>' + game[team + 'Hits'] + '</td>' +
                            '<td>' + game[team + 'Errors'] + '</td>' +
                            '<td>' + game[team + 'HomeRuns'] + '</td>');
            
            if (game.status === 'Final') {
                // Mark winner
                if (team === 'away' && game.awayRuns > game.homeRuns) {
                    $teamRow.addClass('winner');
                }
                else if (team === 'home' && game.homeRuns > game.awayRuns) {
                    $teamRow.addClass('winner');
                }
            }
            
            $table.append($teamRow);
        });
        
        if (!fullBoxScores) {
            $table.addClass('summary');
        }
        
        return $table;
    }
};

var homeView = {
    name: 'home',
    description: 'Home',
    
    canShow: function(location) {
        if (location === homeView.name) {
            return true;
        }
        
        return false;
    },
    
    show: function() {
        var $content = $('#content')
                .empty()
                .append('<h2>Today\'s Games</h2>')
                .append('<div id="todaysgames"><p>Loading today\'s games...</p></div>')
                .append('<h2>Yesterday\'s Games</h2>')
                .append('<div id="yesterdaysgames" class="gamewrapper"><p>Loading yesterday\'s games...</p></div>');
        
        $.ajax('../api/games/today')
                .then(function(games) {
                    games.sort(sort.games);
                    
                    var $div = $('#todaysgames')
                            .empty();
                    
                    $.each(games, function(index, game) {
                        $div.append(make.gameSummary(game, true));
                    });
                })
                .fail(function(error) {
                    $('#todaysgames')
                            .empty()
                            .append('<p>An error ocurred while loading today\'s games.</p>');
                });
        
        $.ajax('../api/games/yesterday')
                .then(function(games) {
                    games.sort(sort.games);
            
                    var $div = $('#yesterdaysgames')
                            .empty();
                    
                    $.each(games, function(index, game) {
                        $div.append(make.gameSummary(game));
                    });
                })
                .fail(function(error) {
                    $('#yesterdaysgames')
                            .empty()
                            .append('<p>An error ocurred while loading yesterday\'s games.</p>');
                });
    }
};

var teamView = {
    name: 'teams',
    description: 'Team Stats',
    
    canShow: function(location) {
        if (location === teamView.name) {
            return true;
        }
        else if (location.substring(0, 6) === 'teams/' && location.length > 6) {
            return true;
        }
        
        return false;
    },
    
    show: function(location) {
        var $content = $('#content')
                .empty()
                .append('<h2>Select a Team</h2>' +
                        '<div id="teamSelectorDiv"><p>Loading teams...</p></div>' +
                        '<div id="teamSummaryDiv"></div>' +
                        '<div id="teamGamesDiv"></div>');
        
        $.ajax('../api/teams')
                .then(function(teams) {
                    teams.sort(sort.teamsByCity);
                    
                    var $div = $('#teamSelectorDiv').empty();
                    
                    var $teamSelector = $('<select id="teamSelector"></select>')
                            .on('change', teamView.navigateToTeam)
                            .appendTo($div);
                    
                    $.each(teams, function(index, team) {
                        $teamSelector.append(
                                '<option value="' + team.abbr + '" id="team' + team.abbr + '">' +
                                    team.city + ' ' + team.name +
                                '</option>'
                        );
                    });
                    
                    if (location.length > 6) {
                        var team = window.location.hash.substring(7);
                        $('#teamSelector').val(team);
                    }
                    else {
                        teamView.navigateToTeam();
                    }
                })
                .fail(function(error) {
                    $('#teamSelectorDiv')
                            .empty()
                            .append('<p>An error ocurred while loading the team data.</p>');
                });
        
        if (location.length > 6) {
            teamView.loadTeam();
        }
    },
    
    navigateToTeam: function() {
        window.location.hash = 'teams/' + $('#teamSelector').val();
    },
    
    loadTeam: function() {
        var team = window.location.hash.substring(7);
        
        $('#teamSummaryDiv')
                .empty()
                .append('<h2>Team Summary</h2>' +
                        '<p>Loading team summary...</p>'
                );
        
        $('#teamGamesDiv')
                .empty()
                .append('<h2>Recent Games</h2>' +
                        '<p>Loading recent games...</p>'
                );
        
        $.ajax('../api/stats/' + team)
                .then(function(stats) {
                    var $div = $('#teamSummaryDiv')
                            .empty()
                            .append('<h2>' + stats.city + ' ' + stats.name + '</h2>');
                    
                    var $table =
                            $('<table class="teamsummary">' +
                                '<tr>' +
                                    '<tr>' +
                                        '<th>Year</th>' +
                                        '<th>Games</th>' +
                                        '<th>Wins</th>' +
                                        '<th>Losses</th>' +
                                        '<th>Win %</th>' +
                                    '<tr>' +
                                '</table>');
                    
                    $.each(stats.data.years, function(year, data) {
                        $table.append(
                                '<tr>' +
                                    '<td>' + year + '</td>' +
                                    '<td>' + data.games + '</td>' +
                                    '<td>' + data.wins + '</td>' +
                                    '<td>' + data.losses + '</td>' +
                                    '<td>' + (data.winrate * 100).toFixed(1) + '%</td>' +
                                '</tr>');
                    });
                    
                    $div.append($table);
                })
                .fail(function(error) {
                    $('#teamSummaryDiv')
                            .empty()
                            .append('<h2>Team Summary</h2>')
                            .append('<p>An error ocurred while loading the team\'s information.</p>');
                });
        
        $.ajax('../api/recentgames/' + team)
                .then(function(games) {
                    games.sort(sort.games).reverse();
                    
                    var $div = $('#teamGamesDiv')
                            .empty()
                            .append('<h2>Recent Games</h2>');
                    
                    var $gamesDiv = $('<div class="gameswrapper"></div>')
                            .appendTo($div);
                    
                    $.each(games, function(index, game) {
                        $gamesDiv.append(make.gameSummary(game, true));
                    });
                })
                .fail(function(error) {
                    $('#teamGamesDiv')
                            .empty()
                            .append('<h2>Recent Games</h2>')
                            .append('<p>An error ocurred while loading the team\'s recent games.</p>');
                });
    }
};

var plotView = {
    name: 'plotter',
    description: 'Plotter',
    
    canShow: function(location) {
        if (location === plotView.name) {
            return true;
        }
        
        return false;
    },
    
    show: function() {
        var $content = $('#content')
                .empty()
                .append('<h2>Select a Team</h2>' +
                        '<div id="teamSelectorDiv"><p>Loading teams...</p></div>' +
                        '<div id="plotArea"></div>'
                );
        
        $.ajax('../api/teams')
                .then(function(teams) {
                    teams.sort(sort.teamsByCity);
                    
                    var $div = $('#teamSelectorDiv').empty();
                    
                    var $teamSelector = $('<select id="teamSelector"></select>')
                            .on('change', plotView.plot)
                            .appendTo($div);
                    
                    $.each(teams, function(index, team) {
                        $teamSelector.append(
                                '<option value="' + team.abbr + '" id="team' + team.abbr + '">' +
                                    team.city + ' ' + team.name +
                                '</option>'
                        );
                    });
                    
                    // Plot options
                    $div.append(
                            '<p><select id="dataSelector">' +
                                '<option value="winrates">Win Rate</option>' +
                                '<option value="games">Games Played</option>' +
                                '<option value="wins">Wins</option>' +
                                '<option value="losses">Losses</option>' +
                            '</select></p>');
                    
                    $('#dataSelector').on('change', plotView.plot);
                    
                    $byMonth = $('<input type="radio" checked name="plotBy" value="month" id="byMonth"> <label for="byMonth">Plot by month</label>')
                            .on('click', plotView.plot);
                    $byYear = $('<input type="radio" name="plotBy" value="year" id="byYear"> <label for="byYear">Plot by year</label>')
                            .on('click', plotView.plot);
                    
                    $byContainer = $('<p></p>')
                            .append($byMonth)
                            .append('<br>')
                            .append($byYear)
                            .appendTo($div);
                    
                    plotView.plot();
                })
                .fail(function(error) {
                    $('#teamSelectorDiv')
                            .empty()
                            .append('<p>An error ocurred while loading the team data.</p>');
                });
    },
    
    plot: function() {
        var team = $('#teamSelector').val();
        var show = $('#dataSelector').val();
        var by = $('input[name=plotBy]:checked').val();
        
        $.ajax('../api/stats/' + team + '/' + by)
                .then(function(stats) {
                    var $plotArea = $('#plotArea')
                            .empty()
                            .append('<h2>Plot</h2>' +
                                    '<div id="plotContainer"></div>');
                    
                    plotView.createPlot(stats, show, by);
                })
                .fail(function(error) {
                    $('#plotArea')
                            .empty()
                            .append('<p>An error occurred while retrieving the data.</p>');
                });
    },
    
    createPlot: function(stats, show, by) {
        var title = stats.city + ' ' + stats.name + ' - ';
        var yTitle = '';
        var xLabels;
        var dataSeries = [];
        var yMax;
        var toolTipFormatter;
        var labelFormatter;
        var legendEnabled = false;
        
        switch (show) {
        case 'winrates':
            title += 'Win Rate';
            yTitle = 'Percent of Games Won';
            yMax = 1;
            toolTipFormatter = function() {
                return '<b>' + this.x + ' ' + this.series.name + ':</b> ' + 
                        (this.point.y * 100).toFixed(1) + '%';
            };
            labelFormatter = function() {
                return (this.value * 100) + '%';
            };
            break;
        case 'games':
            title += 'Games Played';
            yTitle = 'Games Played';
            toolTipFormatter = function() {
                return '<b>' + this.x + ' ' + this.series.name + ':</b> ' +
                        this.point.y + ' games played';
            };
            break;
        case 'wins':
            title += 'Wins';
            yTitle = 'Games Won';
            toolTipFormatter = function() {
                return '<b>' + this.x + ' ' + this.series.name + ':</b> ' +
                        this.point.y + ' games won';
            };
            break;
        case 'losses':
            title += 'Losses';
            yTitle = 'Games Lost';
            toolTipFormatter = function() {
                return '<b>' + this.x + ' ' + this.series.name + ':</b> ' +
                        this.point.y + ' games lost';
            };
            break;
        }
        
        if (by === 'month') {
            legendEnabled = true;
            xLabels = stats.data.series.months;
            $.each(stats.data.series.years, function(year, data) {
                dataSeries.push({
                    name: year,
                    data: data[show]
                });
            });
        }
        else {
            xLabels = stats.data.series.years;
            dataSeries.push({
                name: show,
                data: stats.data.series[show]
            });
        }
        
        $('#plotContainer').highcharts({
                tooltip: {
                    formatter: toolTipFormatter
                },
            
                title: {
                    text: title
                },
                
                yAxis: {
                    title: {
                        text: yTitle
                    },
                    
                    labels: {
                        formatter: labelFormatter
                    },
                    
                    max: yMax
                },
                
                xAxis: {
                    categories: xLabels
                },
                
                legend: {
                    enabled: legendEnabled,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                
                series: dataSeries
        });
    }
};

var app = {
    views: [
        homeView,
        teamView,
        plotView
    ],
    
    init: function() {
        app.createNav();
        $(window).bind('hashchange', app.loadPage);
        
        if (!app.loadPage()) {
            homeView.show();
            $('#link' + homeView.name).addClass('selected');
        }
    },
    
    createNav: function() {
        $.each(app.views, function(index, view) {
            $('#nav').append(
                    '<li><a href="#' + view.name + '" id="link' + view.name + '">' +
                        view.description + '</a></li>'
            );
        });
        
        $('h1').empty()
                .append('<a href="#home">MLB Statistics</a>');
    },
    
    loadPage: function() {
        var validLocation = false;
        
        if (window.location.hash) {
            var location = window.location.hash.substring(1);
            
            $.each(app.views, function(index, view) {
                if (view.canShow(location)) {
                    validLocation = true;
                    $('#nav .selected').removeClass('selected');
                    $('#link' + view.name).addClass('selected');
                    view.show(location);
                }
            });
        }
        
        return validLocation;
    }
};

$(document).ready(app.init);
