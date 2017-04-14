package mlbweb.views

class Teams {
	
	String abbr
	String name
	String city

    static constraints = {
    }
	
	static mapping = {
		table 'game'
	}
}
