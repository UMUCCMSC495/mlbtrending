package mlbweb

class MainController {

    def index() { 
		render "Hello World"
	}
	
	def test() {
		render(contentType: "text/json") {
			person(name:'John', number:'12345')
		}
	}
}
