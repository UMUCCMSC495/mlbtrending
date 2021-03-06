modules = {
    application {
        resource url:'js/application.js'
    }
	css {
		dependsOn 'application'
		resource url: 'ext-4.2.1/resources/ext-theme-neptune/ext-theme-neptune-all.css'
	}
	ext_resources {
		dependsOn 'css'
		resource url:'ext-4.2.1/ext-all.js'
	}
	common {
		dependsOn 'ext_resources'
		resource url:'app/common/Globals.js'
	}
	model {
		dependsOn 'common'
		resource url:'app/model/Team.js'
	}
	store {
		dependsOn 'model'
		resource url:'app/store/Teams.js'
	}
	views {
		dependsOn 'common, store'
		resource url:'app/view/Viewport.js'
		resource url:'app/view/Home.js'
		resource url:'app/view/Teams.js'
		resource url:'app/view/TeamStats.js'
		resource url:'app/view/TeamHistory.js'
		resource url:'app/view/TodaysGames.js'
		resource url:'app/view/YesterdaysGames.js'
		resource url:'app/view/Plotter.js'
		resource url:'app/view/TeamChart.js'
		resource url:'app/view/components/TeamCombobox.js'
	}
	mlb_app {
		dependsOn 'views'
		resource url:'app.js'
	}
}