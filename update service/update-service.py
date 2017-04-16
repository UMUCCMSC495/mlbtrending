import config
import MySQLdb
import datetime
import urllib.request
import json
import dateutil.parser

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
    def __init__(self, name, abbr, city):
        self.id = 0

        self.name = name
        self.abbr = abbr
        self.city = city

class Inning:
    def __init__(self, awayTeam, homeTeam, awayRuns, homeRuns):
        self.awayTeam = awayTeam
        self.homeTeam = homeTeam

        self.awayRuns = awayRuns
        self.homeRuns = homeRuns

def retrieveData(date):
    """Connects to the MLB API and returns the raw data for the given date."""

    # http://gd2.mlb.com/components/game/mlb/year_XXXX/month_XX/day_XX/master_scoreboard.json
    urlString = 'http://gd2.mlb.com/components/game/mlb/year_{:4d}/month_{:02d}/day_{:02d}/master_scoreboard.json'

    url = urlString.format(date.year, date.month, date.day)
    data = urllib.request.urlopen(url).read()
    data = json.loads(data)
    data = data['data']['games']

    return data

def getDates(rawData):
    """Returns the dates the data was modified and the games took place."""
    dataDate = dateutil.parser.parse(rawData['modified_date'])
    # Convert to timezone-unaware type
    dataDate = dataDate.replace(tzinfo = None)

    gameDate = datetime.date(int(rawData['year']), int(rawData['month']), int(rawData['day']))

    return (dataDate, gameDate)

def dataIsNewer(connection, dataDate):
    """Checks whether the raw data is newer than the existing data."""
    cursor = connection.cursor()
    cursor.execute('SELECT last_modified FROM t_meta;')

    lastModified = cursor.fetchone()[0]
    cursor.close()

    return True if (dataDate > lastModified) else False

def loadGameData(gameDate, rawData):
    """Turns raw data into Games, Teams, and Innings."""
    games = []

    # A single team may play more than one game on the same day
    teams = {}

    for gameData in rawData['game']:
        awayTeamName = gameData['away_team_name']
        awayTeamAbbr = gameData['away_name_abbrev']
        awayTeamCity = gameData['away_team_city']

        if awayTeamAbbr not in teams.keys():
            awayTeam = Team(awayTeamName, awayTeamAbbr, awayTeamCity)
            teams[awayTeamAbbr] = awayTeam
        else:
            awayTeam = teams[awayTeamAbbr]

        homeTeamName = gameData['home_team_name']
        homeTeamAbbr = gameData['home_name_abbrev']
        homeTeamCity = gameData['home_team_city']

        if homeTeamAbbr not in teams.keys():
            homeTeam = Team(homeTeamName, homeTeamAbbr, homeTeamCity)
            teams[homeTeamAbbr] = homeTeam
        else:
            homeTeam = teams[homeTeamAbbr]

        game = Game(gameDate, awayTeam, homeTeam)

        innings = []

        # If the game hasn't started yet, there will be no linescore
        if 'linescore' in gameData.keys():
            game.awayTeamRuns = gameData['linescore']['r']['away']
            game.awayTeamHits = gameData['linescore']['h']['away']
            game.awayTeamErrors = gameData['linescore']['e']['away']
            game.awayTeamHomeRuns = gameData['linescore']['hr']['away']

            game.homeTeamRuns = gameData['linescore']['r']['home']
            game.homeTeamHits = gameData['linescore']['h']['home']
            game.homeTeamErrors = gameData['linescore']['e']['home']
            game.homeTeamHomeRuns = gameData['linescore']['hr']['home']

            for inningData in gameData['linescore']['inning']:
                # Ensure that the inning has data
                if inningData is dict:
                    awayRuns = inningData['away'] if ('away' in inningData.keys()) else 0
                    homeRuns = inningData['home'] if ('home' in inningData.keys()) else 0

                    inning = Inning(awayTeam, homeTeam, awayRuns, homeRuns)

                    innings.append(inning)

        game.innings = innings

        games.append(game)

    return games

def saveData(connection, dataDate, games):
    """Saves the game data to the database."""

    # Save

    # Save game data

    # Save inning data

    pass

def tablesExist(connection):
    """Returns true if necessary tables and views appear to exist."""
    tablesNeeded = [
        't_meta',
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

    # Suppress MySQL warning messages raised when INSERT IGNORE runs into
    # duplicate keys
    warnings.filterwarnings('ignore', category = MySQLdb.Warning)

    if not tablesExist(db):
        createTablesAndViews(db)

    # TODO: implement error handling (e.g. JSON data unavailable)
    rawData = retrieveData(datetime.date.today())

    (dataDate, gameDate) = getDates(rawData)

    if dataIsNewer(db, dataDate):
        games = loadGameData(gameDate, rawData)

        saveData(db, dataDate, games)
