class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/info/$action?/$id?(.${format})?"(controller: 'info', namespace: 'common')
		
		"/"(view:"/index")
	}
}
