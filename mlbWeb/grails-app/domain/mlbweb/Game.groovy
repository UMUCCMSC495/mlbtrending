package mlbweb

class Game {
	
	Team away
	Team home
	Date game_date
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

    static constraints = {
    }
	
	static mapping = {
		table 't_game'
		version false
	}
}
