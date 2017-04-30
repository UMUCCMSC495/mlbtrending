dataSource {
    pooled = true
}

hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory'
}

// environment specific settings
environments {
    development {
        dataSource {
            pooled = true
            dbCreate = "create-drop"
            
            driverClassName = "com.mysql.jdbc.Driver"
            dialect = org.hibernate.dialect.MySQL5InnoDBDialect
            
            uri = new URI(System.env.DATABASE_URL?:"mysql://baseball:glove@localhost:3306/baseballdb")
            url = "jdbc:mysql://" + uri.host + ":" + uri.port + uri.path
            username = uri.userInfo.split(":")[0]
            password = uri.userInfo.split(":")[1]
        }
    }
    test {
        dataSource {
            pooled = true
            dbCreate = "validate"
            
            driverClassName = "com.mysql.jdbc.Driver"
            dialect = org.hibernate.dialect.MySQL5InnoDBDialect
            
            uri = new URI(System.env.DATABASE_URL?:"mysql://baseball:glove@localhost:3306/baseballdb")
            url = "jdbc:mysql://" + uri.host + ":" + uri.port + uri.path
            username = uri.userInfo.split(":")[0]
            password = uri.userInfo.split(":")[1]
        }
    }
    production {
        dataSource {
            pooled = true
            dbCreate = "validate"
            
            driverClassName = "com.mysql.jdbc.Driver"
            dialect = org.hibernate.dialect.MySQL5InnoDBDialect
            
            uri = new URI(System.env.DATABASE_URL?:"mysql://baseball:glove@localhost:3306/baseballdb")
            url = "jdbc:mysql://" + uri.host + ":" + uri.port + uri.path
            username = uri.userInfo.split(":")[0]
            password = uri.userInfo.split(":")[1]
            
            properties {
                validationQuery="SELECT 1"
                validationQueryTimeout = 3
                validationInterval = 15000
            }
        }
    }
}
