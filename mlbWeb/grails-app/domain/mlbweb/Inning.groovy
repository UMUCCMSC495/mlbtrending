package mlbweb

class Inning {
    static belongsTo = [game: Game]
    
    Team away
    Team home
    Date gameDate
    
    int inningNumber
    int awayRuns
    int homeRuns

    static constraints = {
        inningNumber min: 0
        awayRuns min: 0, nullable: true
        homeRuns min: 0, nullable: true
    }

    static mapping = {
        version false
    }
}