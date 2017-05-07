class UrlMappings {
    static mappings = {
        "/api/teams" {
            controller = "api"
            action = "teams"
        }
        
        "/api/games/$when?" {
            controller = "api"
            action = "games"
        }
        
        "/api/recentgames/$team?" {
            controller = "api"
            action = "recentgames"
        }
        
        "/api/stats/$team/$grouping?" {
            controller = "api"
            action = "stats"
        }

        "/"(view:"/index")
    }
}
