package mlbweb
import grails.converters.JSON

class ApiController {
    def teams() {
        render Team.listOrderByName() as JSON
    }
    
    def games() {
        def when = params.when ?: "today"
        
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
    
    def recentgames() {
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
            summary.games = Game.countAllBy(team, grouping).list()
            summary.wins = Game.countWinsBy(team, grouping).list()
            summary.losses = Game.countLossesBy(team, grouping).list()
            render summary as JSON
        }
    }
    
    // TODO: API calls for game stats
}
