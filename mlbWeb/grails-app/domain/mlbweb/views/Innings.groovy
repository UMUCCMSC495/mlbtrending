package mlbweb.views

class Innings {
	
	String awayTeam
	String homeTeam
	Date gameDate
	int inningNumber
	String awayName
	String awayCity
	String homeName
	String homeCity
	int awayRuns
	int homeRuns

    static constraints = {
    }
	
	static mapping = {
		table 'innings'
		version false
	}
}
