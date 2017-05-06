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
            
            /**
             * data: {
             *     2016: {
             *         games: 100,
             *         wins: 50,
             *         losses: 50
             *         winrate: 0.5
             *     },
             *     2017: {
             *         games: 100,
             *         wins: 60,
             *         losses: 40,
             *         winrate: 0.6
             *     }
             * }
             */
            summary.data = new LinkedHashMap()
            
            def games = Game.countAllBy(team, grouping).list()
            def wins = Game.countWinsBy(team, grouping).list()
            def losses = Game.countLossesBy(team, grouping).list()
            
            games.each {
                def container = summary.data.get(it[0], new LinkedHashMap())
                container.games = it[1]
            }
            wins.each {
                def container = summary.data.get(it[0], new LinkedHashMap())
                container.wins = it[1]
            }
            losses.each {
                def container = summary.data.get(it[0], new LinkedHashMap())
                container.losses = it[1]
            }
            
            summary.data.each { year, data ->
                data.winrate = (data.wins / data.games * 100).setScale(1, RoundingMode.HALF_UP).toString() + "%"
            }
            
            render summary as JSON
        }
    }
}
