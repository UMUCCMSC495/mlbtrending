modules = {
    application {
        resource url:'js/application.js'
    }
	css {
		dependsOn 'application'
//		resource url: 'ext-4.2.1/resources/css/ext-all-neptune.css'
//		resource url: 'ext-4.2.1/resources/css/ext-theme-neptune/ext-theme-neptune-all.css'
		resource url: 'ext-4.2.1/resources/ext-theme-neptune/ext-theme-neptune-all.css'
	}
	ext_resources {
		dependsOn 'css'
		resource url:'ext-4.2.1/ext-all-debug.js'
//		resource url:'ext-4.2.1/ext-theme-neptune.js'
//		resource url:'ext-6.2.0/modern/theme-triton/theme-triton.js'
	}
	common {
		dependsOn 'ext_resources'
		resource url:'app/common/Globals.js'
	}
	views {
		dependsOn 'common'
		resource url:'app/view/Viewport.js'
		resource url:'app/view/Home.js'
		resource url:'app/view/Teams.js'
		resource url:'app/view/Plotter.js'
	}
	mlb_app {
		dependsOn 'views'
		resource url:'app.js'
	}
}