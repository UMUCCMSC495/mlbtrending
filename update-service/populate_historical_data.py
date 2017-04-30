import config
import MySQLdb
import warnings

from datetime import datetime, timedelta
import update_service
import time

def daterange(start, end):
    for i in range(int((end - start).days)):
        yield start + timedelta(days = i)

def updateDataForDates(start, end):
    for date in daterange(start, end + timedelta(days = 1)):
        print('[{:%Y-%m-%d %H:%M:%S}] Getting data for date: {:%Y-%m-%d}'.format(datetime.now(), date))
        update_service.updateDataForDate(connection, date, False)
        time.sleep(5)

if __name__ == '__main__':
    dbConfig = config.getConfig()
    connection = MySQLdb.connect(
        host = dbConfig['host'],
        port = dbConfig['port'],
        user = dbConfig['username'],
        passwd = dbConfig['password'],
        db = dbConfig['database']
    )

    # Suppress MySQL warning messages raised when INSERT IGNORE runs into
    # duplicate keys
    warnings.filterwarnings('ignore', category = MySQLdb.Warning)

    if not update_service.tablesExist(connection):
        update_service.createTablesAndViews(connection)

    # 2015 MLB season: 4/5/2015 - 11/1/2015
    #start = datetime.strptime('04/05/2015', '%m/%d/%Y')
    #end = datetime.strptime('11/01/2015', '%m/%d/%Y')
    #print('2015 MLB season')
    #updateDataForDates(start, end)
    # Removed 2015 - too much data for ClearDB ignite instance (limited to 5 MB)

    # 2016 MLB season: 4/3/2016 - 11/2/2016
    start = datetime.strptime('04/03/2016', '%m/%d/%Y')
    end = datetime.strptime('11/02/2016', '%m/%d/%Y')
    print('2016 MLB season')
    updateDataForDates(start, end)

    # 2017 MLB season: 4/2/2017 - 11/1/2017
    start = datetime.strptime('04/02/2017', '%m/%d/%Y')
    end = datetime.strptime('11/01/2017', '%m/%d/%Y')
    today = datetime.today()

    # Don't go past today
    if today < end:
        end = today

    print('2017 MLB season')
    updateDataForDates(start, end)

    connection.close()
