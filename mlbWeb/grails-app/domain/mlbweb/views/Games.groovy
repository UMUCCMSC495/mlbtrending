package mlbweb.views

class Games {
	
	String awayTeam
	String homeTeam
	Date gameDate
	String awayName
	String awayCity
	String homeName
	String homeCity
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
		table 'game'
		version false
	}
}
