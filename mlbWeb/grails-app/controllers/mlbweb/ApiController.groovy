package mlbweb
import grails.converters.JSON
import java.math.RoundingMode

class ApiController {
    def teams() {
        render Team.listOrderByName() as JSON
    }
    
    def games() {
        def when = params.arg ?: "today"
        
        switch (when) {
        case "yesterday":
            def from = new Date().clearTime() - 1
            def to = from + 1
            
            JSON.use("deep") {
                render Game.findAllByGameDateBetween(from, to) as JSON
            }
            break
        case "today":
        default:
            def from = new Date().clearTime()
            def to = from + 1
            
            JSON.use("deep") {
                render Game.findAllByGameDateBetween(from, to) as JSON
            }
            break
        }
    }
    
    def recentgames() 
	{
        def teamAbbr = params.team ?: "none"
        
        def team = Team.findByAbbrIlike(teamAbbr)
        
        if (null == team) {
            response.status = 404
        }
        else {
            JSON.use("deep") {
                render Game.recentGames(team).list() as JSON
            }
        }
    }
    
    def stats() {
        def teamAbbr = params.team ?: "none"
        def grouping = params.grouping ?: "year"
        
        def team = Team.findByAbbrIlike(teamAbbr)
        
        if (null == team) {
            response.status = 404
        }
        else {
            def summary = new LinkedHashMap()
            summary.abbr = team.abbr
            summary.city = team.city
            summary.name = team.name
            
            summary.data = new LinkedHashMap()
            summary.data.years = new LinkedHashMap()
            summary.data.series = new LinkedHashMap()
            
            def games = Game.countAllBy(team, grouping).list()
            def wins = Game.countWinsBy(team, grouping).list()
            def losses = Game.countLossesBy(team, grouping).list()
            
            if (grouping == "month") {
                /**
                 * data: {
                 *     Data objects
                 * 
                 *     years: {
                 *         2016: {
                 *             4: {
                 *                 games: 10,
                 *                 wins: 5,
                 *                 losses: 5
                 *                 winrate: 0.5
                 *             },
                 *             5: {
                 *                 games: 10,
                 *                 wins: 5,
                 *                 losses: 5
                 *                 winrate: 0.5
                 *             }
                 *         },
                 *         2017: {
                 *             ...
                 *         }
                 *     }
                 *     
                 *     Data series
                 *     
                 *     series: {
                 *         months: [ 'Apr', 'May', 'Jun', ... ]
                 *         
                 *         years: {
                 *             2016: {
                 *                 games: [ 5, 5, 5... ],
                 *                 wins: [ 5, 5, 5... ],
                 *                 losses: [ 5, 5, 5... ],
                 *                 winrate: [ 5, 5, 5... ],
                 *             },
                 *             2017: {
                 *                 ...
                 *             }
                 *         }
                 *     }
                 * }
                 */
                
                // Data objects
                ["games": games, "wins": wins, "losses": losses].each { dataTypeName, data ->
                    data.each { row ->
                        def yearContainer = summary.data.years.get(row[0], new LinkedHashMap())
                        def monthContainer = yearContainer.get(row[1], new LinkedHashMap())

                        yearContainer[row[1]][dataTypeName] = row[2];
                    }
                }
                
                summary.data.years.each { year, yearData ->
                    yearData.each { month, monthData ->
                        def w = monthData.get('wins', 0)
                        monthData.winrate = 
                                (w / monthData.games).setScale(3, RoundingMode.HALF_UP)
                    }
                }
                
                // Data series
                summary.data.series.years = new LinkedHashMap()
                
                def minMonth = 12
                
                summary.data.years.each { year, yearData ->
                    summary.data.series.years[year] = new LinkedHashMap()
                    summary.data.series.years[year].games = new ArrayList()
                    summary.data.series.years[year].wins = new ArrayList()
                    summary.data.series.years[year].losses = new ArrayList()
                    summary.data.series.years[year].winrates = new ArrayList()
                    
                    yearData.each { month, monthData ->
                        if (month < minMonth) {
                            minMonth = month
                        }
                        
                        summary.data.series.years[year].games.push(monthData.games)
                        summary.data.series.years[year].wins.push(monthData.wins)
                        summary.data.series.years[year].losses.push(monthData.losses)
                        summary.data.series.years[year].winrates.push(monthData.winrate)
                    }
                }
                
                def months = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ]
                minMonth -= 1
                summary.data.series.months = months[minMonth..11]
            }
            // Group by year
            else {
                /**
                 * data: {
                 *     Data objects
                 * 
                 *     years: {
                 *         2016: {
                 *             games: 100,
                 *             wins: 50,
                 *             losses: 50
                 *             winrate: 0.5
                 *         },
                 *         2017: {
                 *             games: 100,
                 *             wins: 60,
                 *             losses: 40,
                 *             winrate: 0.6
                 *         }
                 *     },
                 *     
                 *     Data series
                 *     
                 *     series: {
                 *         years: [ 2016, 2017 ],
                 *         games: [ 130, 130 ],
                 *         wins: [ 120, 110 ],
                 *         losses: [ 110, 120 ],
                 *         winrates: [ 55%, 45% ]
                 *     }
                 * }
                 */
                
                // Data objects
                ["games": games, "wins": wins, "losses": losses].each { dataTypeName, data ->
                    data.each { row ->
                        def yearContainer = summary.data.years.get(row[0], new LinkedHashMap())

                        yearContainer[dataTypeName] = row[1];
                    }
                }

                summary.data.years.each { year, data ->
                    def w = data.get('wins', 0)
                    data.winrate = (w / data.games).setScale(3, RoundingMode.HALF_UP)
                }
                
                // Data series
                summary.data.series.years = new ArrayList()
                summary.data.series.games = new ArrayList()
                summary.data.series.wins = new ArrayList()
                summary.data.series.losses = new ArrayList()
                summary.data.series.winrates = new ArrayList()
                
                summary.data.years.each { year, yearData ->
                    summary.data.series.games.push(yearData.games)
                    summary.data.series.wins.push(yearData.wins)
                    summary.data.series.losses.push(yearData.losses)
                    summary.data.series.winrates.push(yearData.winrate)
                }
            }
            
            render summary as JSON
        }
    }
}
