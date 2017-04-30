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
            // TODO: Limit to only yesterday's games
            JSON.use("deep") {
                render Game.find().list() as JSON
            }
            break
        case "today":
        default:
            // TODO: Limit to only today's games
            JSON.use("deep") {
                render Game.find().list() as JSON
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
