package mlbweb

class Team {
    String abbr
    String name
    String city
	
    static constraints = {
        abbr maxSize: 16, unique: true
        name maxSize: 128
        city maxSize: 128
    }
	
    static mapping = {
        version false
    }
}
