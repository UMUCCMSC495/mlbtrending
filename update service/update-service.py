import config
import MySQLdb
from datetime import date
import urllib.request
import json

class Game:
    def __init__(self, date, awayTeam, homeTeam):
        self.id = 0

        self.date = date
        self.awayTeam = awayTeam
        self.homeTeam = homeTeam

        self.awayTeamRuns = 0
        self.awayTeamHits = 0
        self.awayTeamErrors = 0
        self.awayTeamHomeRuns = 0

        self.homeTeamRuns = 0
        self.homeTeamHits = 0
        self.homeTeamErrors = 0
        self.homeTeamHomeRuns = 0

        self.innings = []

class Team:
    def __init__(self, name, abbreviation, city):
        self.name = name
        self.abbreviation = abbreviation
        self.city = city

class Inning:
    def __init__(self, awayTeam, homeTeam, awayRuns, homeRuns):
        self.awayTeam = awayTeam
        self.homeTeam = homeTeam

        self.awayRuns = awayRuns
        self.homeRuns = homeRuns

def retrieveData(date):
    """Connects to the MLB API and returns the JSON data for the given date."""

    # http://gd2.mlb.com/components/game/mlb/year_XXXX/month_XX/day_XX/master_scoreboard.json
    urlString = 'http://gd2.mlb.com/components/game/mlb/year_{:4d}/month_{:02d}/day_{:02d}/master_scoreboard.json'

    url = urlString.format(date.year, date.month, date.day)
    data = urllib.request.urlopen(url).read()

    return data

def parseData(jsonData):
    """Turns the JSON data into Games, Teams, and Innings."""
    pass

def saveData(connection, gameData):
    """Saves the game data to the database."""
    pass

def tablesExist(connection):
    """Returns true if necessary tables and views appear to exist."""
    tablesNeeded = [
        't_team',
        't_game',
        't_inning',
        'team',
        'game',
        'inning'
        # TODO: add the aggregate views once they're created
    ]

    cursor = connection.cursor()
    cursor.execute("SHOW TABLES;")

    for row in cursor.fetchall():
        tableName = row[0]
        if tableName in tablesNeeded:
            tablesNeeded.remove(tableName)

    cursor.close()

    return True if (len(tablesNeeded) == 0) else False

def createTablesAndViews(connection):
    """Creates the schema tables and views from create.sql."""
    cursor = connection.cursor()

    file = open('sql/create.sql')
    contents = file.read()
    file.close()

    commands = contents.split(';')
    for command in commands:
        cursor.execute(command)

    cursor.close()

if __name__ == '__main__':
    dbConfig = config.getConfig()
    db = MySQLdb.connect(
        host = dbConfig['host'],
        port = dbConfig['port'],
        user = dbConfig['username'],
        passwd = dbConfig['password'],
        db = dbConfig['database']
    )

    if not tablesExist(db):
        createTablesAndViews(db)

    # TODO: implement error handling (e.g. JSON data unavailable)
    jsonData = retrieveData(date.today())
    games = parseData(jsonData)
    saveData(db, games)
