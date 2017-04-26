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
			url = "jdbc:mysql://localhost:3306/localmlbtesting"
			driverClassName = "com.mysql.jdbc.Driver"
			dialect = org.hibernate.dialect.MySQL5InnoDBDialect
			username = "root"
			password = "letmein"
        }
    }
    test {
        dataSource {
            dbCreate = "update"
            url = "jdbc:h2:mem:testDb;MVCC=TRUE;LOCK_TIMEOUT=10000"
        }
    }
    production {
        dataSource {
			pooled = true
			url = "jdbc:mysql://localhost/localmlbtesting"
			driverClassName = "com.mysql.jdbc.Driver"
			dialect = org.hibernate.dialect.MySQL5InnoDBDialect
			username = "root"
			password = "letmein"
            properties {
               validationQuery="SELECT 1"
			   validationQueryTimeout = 3
			   validationInterval = 15000
            }
        }
    }
}
