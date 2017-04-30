package mlbweb
import grails.converters.JSON

class ApiController {
    def teams() {
        render Team.find().list() as JSON
    }
    
    def games() {
        def when = params.arg ?: "today"
        
        switch (when) {
        case "yesterday":
            def from = new Date().clearTime().minus(1)
            def to = from.plus(1)
            
            JSON.use("deep") {
                render Game.findAllByGameDateBetween(from, to) as JSON
            }
            break
        case "today":
        default:
            def from = new Date().clearTime()
            def to = from.plus(1)
            
            JSON.use("deep") {
                render Game.findAllByGameDateBetween(from, to) as JSON
            }
            break
        }
    }
    
    def recentgames() {
        def teamAbbr = params.arg ?: "none"
        
        def team = Team.findByAbbrIlike(teamAbbr) ?: Team.read(1)
        
        // TODO: Limit to games in the past 7 days
        def awayGames = Game.findAllByAway(team)
        def homeGames = Game.findAllByHome(team)
        
        def allGames = awayGames + homeGames
        
        JSON.use("deep") {
            render allGames as JSON
        }
    }
    
    // TODO: API calls for game stats
}
