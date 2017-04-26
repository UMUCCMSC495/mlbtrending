package common

class InfoController {

    def index() {
		render(contentType: "text/json") {
			MlbApp("configLoaded":true)
		}
	}
}
