modules = {
    application {
        resource url:'js/application.js'
    }
	ext_resources {
		resource url:'ext-6.2.0/ext-all-debug.js'
	}
	common {
		dependsOn 'ext_resources'
		resource url:'app/common/Globals.js'
	}
	views {
		dependsOn 'common'
		resource url:'app/view/Viewport.js'
	}
	mlb_app {
		dependsOn 'views'
		resource url:'app.js'
	}
}