package mlbweb

class Game {
    static hasMany = [innings: Inning]

    Team away
    Team home
    Date gameDate

    String status
    String location

    int awayRuns
    int awayHits
    int awayErrors
    int awayHomeRuns

    int homeRuns
    int homeHits
    int homeErrors
    int homeHomeRuns

    static namedQueries = {
        recentGames { team ->
            def to = new Date().clearTime() + 1
            def from = to - 7
            
            or {
                eq "away", team
                eq "home", team
            }
            
            between "gameDate", from, to
        }
    }

    static constraints = {
        status maxSize: 128
        location maxSize: 128

        awayRuns min: 0, nullable: true
        awayHits min: 0, nullable: true
        awayErrors min: 0, nullable: true
        awayHomeRuns min: 0, nullable: true

        homeRuns min: 0, nullable: true
        homeHits min: 0, nullable: true
        homeErrors min: 0, nullable: true
        homeHomeRuns min: 0, nullable: true
    }

    static mapping = {
        version false
        sort gameDate: "asc"
        innings sort: "inningNumber", order: "asc"
    }
}
