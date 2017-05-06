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
    
    int year
    int month

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
        
        countAllBy { team, grouping ->
            or {
                eq "away", team
                eq "home", team
            }
            
            projections {
                groupProperty "year"
                
                if (grouping == "month") {
                    groupProperty "month"
                }
                
                count "away", "games"
            }
        }
        
        countWinsBy { team, grouping ->
            or {
                and {
                    eq "away", team
                    gtProperty "awayRuns", "homeRuns"
                }
                
                and {
                    eq "home", team
                    gtProperty "homeRuns", "awayRuns"
                }
            }
            
            projections {
                groupProperty "year"
                
                if (grouping == "month") {
                    groupProperty "month"
                }
                
                count "away", "games"
            }
        }
        
        countLossesBy { team, grouping ->
            or {
                and {
                    eq "away", team
                    ltProperty "awayRuns", "homeRuns"
                }
                
                and {
                    eq "home", team
                    ltProperty "homeRuns", "awayRuns"
                }
            }
            
            projections {
                groupProperty "year"
                
                if (grouping == "month") {
                    groupProperty "month"
                }
                
                count "away", "games"
            }
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
        year formula: 'YEAR(game_date)'
        month formula: 'MONTH(game_date)'
    }
}
