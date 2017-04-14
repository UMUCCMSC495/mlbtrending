package mlbweb

class Inning {
	
	Team away
	Team home
	Date gameDate
	int inningNumber
	int awayRuns
	int homeRuns

    static constraints = {
    }

	static mapping = {
		table 't_inning'
		version false
	}
}