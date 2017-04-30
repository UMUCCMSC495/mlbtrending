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
        def teamAbbr = params.arg ?: "none"
        
        def team = Team.findByAbbrIlike(teamAbbr) ?: Team.read(1)
        
        if (null == team) {
            // Database contains no team information
            render ""
        }
        else {
            JSON.use("deep") {
                render Game.recentGames(team).list() as JSON
            }
        }
    }
    
    // TODO: API calls for game stats
}
