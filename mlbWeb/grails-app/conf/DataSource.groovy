dataSource {
    pooled = true
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory'
}
// environment specific settings
environments {
	localmlbtesting {
		pooled = true
		dbCreate = "create-drop"
		url = "jdbc:mysql://localhost:3306/localmlbtesting"
		driverClassName = "com.mysql.jdbc.Driver"
		dialect = org.hibernate.dialect.MySQL5InnoDBDialect
		username = "root"
		password = "letmein"
		properties {
		   jmxEnabled = true
		   initialSize = 5
		   maxActive = 50
		   minIdle = 5
		   maxIdle = 25
		   maxWait = 10000
		   maxAge = 10 * 60000
		   timeBetweenEvictionRunsMillis = 5000
		   minEvictableIdleTimeMillis = 60000
		   validationQuery = "SELECT 1"
		   validationQueryTimeout = 3
		   validationInterval = 15000
		   testOnBorrow = true
		   testWhileIdle = true
		   testOnReturn = false
		}
	}
	development {
        dataSource {
            dbCreate = "create-drop" // one of 'create', 'create-drop', 'update', 'validate', ''
            url = "jdbc:h2:mem:devDb;MVCC=TRUE;LOCK_TIMEOUT=10000"
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
            dbCreate = "update"
            url = "jdbc:h2:prodDb;MVCC=TRUE;LOCK_TIMEOUT=10000"
            pooled = true
            properties {
               maxActive = -1
               minEvictableIdleTimeMillis=1800000
               timeBetweenEvictionRunsMillis=1800000
               numTestsPerEvictionRun=3
               testOnBorrow=true
               testWhileIdle=true
               testOnReturn=true
               validationQuery="SELECT 1"
            }
        }
    }
}
