package mlbweb
import grails.converters.JSON

class ApiController {
    def teams() {
        render Team.find().list() as JSON
    }
    
    def games() {
        def arg = params.arg ?: "today"
        
        def st
        
        switch (arg) {
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
}
