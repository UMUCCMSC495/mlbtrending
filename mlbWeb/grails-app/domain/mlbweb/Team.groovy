package mlbweb

class Team {

	String abbr
	String name
	String city
	
    static constraints = {
    }
	
	static mapping = {
		table 't_team'
		version false
	}
}
