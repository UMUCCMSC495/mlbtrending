class UrlMappings {
    static mappings = {
        "/info/$action?/$id?(.${format})?"(controller: 'info', namespace: 'common')

        "/api/$action/(${arg})?" {
            controller = "api"
        }

        "/"(view:"/index")
    }
}
