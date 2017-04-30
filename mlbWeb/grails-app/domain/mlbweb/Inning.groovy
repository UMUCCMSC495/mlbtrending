package mlbweb

class Inning {
    static belongsTo = [game: Game]
    
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