import config
import MySQLdb
import datetime
import urllib.request
import json
import dateutil.parser
import warnings
import logging

class Game:
    def __init__(self, date, awayTeam, homeTeam):
        self.id = -1

        self.date = date
        self.awayTeam = awayTeam
        self.homeTeam = homeTeam

        self.status = ''
        self.location = ''

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
        self.id = -1

        self.name = name
        self.abbr = abbr
        self.city = city

class Inning:
    def __init__(self, awayRuns, homeRuns):
        self.awayRuns = awayRuns
        self.homeRuns = homeRuns

def getMLBApiUrlString(date):
    # http://gd2.mlb.com/components/game/mlb/year_XXXX/month_XX/day_XX/master_scoreboard.json
    urlString = 'http://gd2.mlb.com/components/game/mlb/year_{:4d}/month_{:02d}/day_{:02d}/master_scoreboard.json'
    return urlString.format(date.year, date.month, date.day)

def retrieveData(url):
    """Connects to the MLB API and returns the raw data for the given date."""
    data = urllib.request.urlopen(url).read()
    data = json.loads(data)
    data = data['data']['games']

    return data

def getDates(rawData):
    """Returns the dates the data was modified and the games took place."""
    dataDate = dateutil.parser.parse(rawData['modified_date'])
    # Convert to timezone-unaware type
    dataDate = dataDate.replace(tzinfo = None)

    gameDate = datetime.datetime(int(rawData['year']), int(rawData['month']), int(rawData['day']))

    gameDate = gameDate.replace(hour = 0, minute = 0, second = 0)

    return (dataDate, gameDate)

def dataIsNewer(connection, dataDate):
    """Checks whether the raw data is newer than the existing data."""
    cursor = connection.cursor()
    cursor.execute('SELECT last_modified FROM t_meta;')

    lastModified = cursor.fetchone()[0]
    cursor.close()

    return True if (dataDate > lastModified) else False

def getOrdinal(number):
    """Returns the ordinal representation of the given number."""
    numberMod = abs(int(number)) % 100

    if numberMod < 11 or numberMod > 20:
        suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
        suffix = suffixes[numberMod % 10]
    else:
        suffix = 'th'

    return str(number) + suffix

def loadGameData(gameDate, rawData):
    """Turns raw data into Games, Teams, and Innings."""
    games = []

    teams = {}

    # Ensure that the date had any games played at all
    if 'game' in rawData.keys():
        # Discard irregular game dates (e.g. All-Star Games)
        if not isinstance(rawData['game'], dict):
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

                (gameHour, gameMinute) = gameData['time'].split(':')
                gameHour = int(gameHour)
                gameMinute = int(gameMinute)

                if gameData['ampm'] == 'PM' and gameHour != 12:
                    gameHour = int(gameHour) + 12

                gameTime = gameDate.replace(hour = gameHour, minute = gameMinute)
                game = Game(gameTime, awayTeam, homeTeam)

                # Obtain inning number
                if gameData['status']['status'] == 'In Progress':
                    game.status = '{0} of {1}'.format(
                        gameData['status']['inning_state'],
                        getOrdinal(gameData['status']['inning'])
                    )
                else:
                    game.status = gameData['status']['status']

                game.location = gameData['location']

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
                        if isinstance(inningData, dict):
                            awayRuns = inningData['away'] if ('away' in inningData.keys()) else "'NULL'"
                            homeRuns = inningData['home'] if ('home' in inningData.keys()) else "'NULL'"

                            if awayRuns == '':
                                awayRuns = "'NULL'"
                            if homeRuns == '':
                                homeRuns = "'NULL'"

                            inning = Inning(awayRuns, homeRuns)

                            innings.append(inning)

                game.innings = innings

                games.append(game)

    return (teams, games)

def saveData(connection, dataDate, teams, games):
    """Saves the game data to the database."""
    cursor = connection.cursor()

    # Save teams
    insertTeam = "INSERT IGNORE INTO team (abbr, name, city) VALUES ('{0}', '{1}', '{2}')"
    for team in teams.values():
        cursor.execute(insertTeam.format(team.abbr, team.name, team.city))
    connection.commit()

    # Retrieve team IDs
    cursor.execute('SELECT id, abbr FROM team;')
    for row in cursor.fetchall():
        # Not every team plays every day; need to ensure that the list of teams
        # that played today includes the given abbreviation
        if row[1] in teams.keys():
            teams[row[1]].id = row[0]

    # Insert games
    deleteInnings = """
DELETE inning.* FROM inning
INNER JOIN game ON inning.game_id = game.id
WHERE game.game_date BETWEEN '{0:%Y-%m-%d} 00:00:00' AND '{1:%Y-%m-%d} 00:00:00';
"""

    deleteGames = """
DELETE FROM game
WHERE game_date BETWEEN '{0:%Y-%m-%d} 00:00:00' AND '{1:%Y-%m-%d} 00:00:00';
"""

    insertGame = """
INSERT INTO game (game_date, away_id, home_id,
    status, location,
    away_runs, away_hits, away_errors, away_home_runs,
    home_runs, home_hits, home_errors, home_home_runs)
VALUES ('{0:%Y-%m-%d %H:%M:%S}', {1}, {2},
    '{3}', '{4}',
    {5},  {6},  {7},  {8},
    {9}, {10}, {11}, {12})
"""

    selectGames = """
SELECT id, away_id, home_id, game_date
FROM game
WHERE game_date BETWEEN '{0:%Y-%m-%d} 00:00:00' AND '{1:%Y-%m-%d} 00:00:00';
"""

    insertInning = """
INSERT INTO inning (game_id, inning_number, away_runs, home_runs)
VALUES ('{0}', {1}, {2}, {3})
"""
    # Ensure there was at least one game to retreive
    if len(games) > 0:
        startDate = games[0].date
        endDate = startDate + datetime.timedelta(days = 1)

        # Delete the innings and games in the table
        cursor.execute(deleteInnings.format(startDate, endDate))
        cursor.execute(deleteGames.format(startDate, endDate))

        gamesByTeamAndDate = {}

        # Re-add the games
        for game in games:
            key = '{0}-{1}@{2:%Y-%m-%d %H:%M:%S}'.format(game.awayTeam.id, game.homeTeam.id, game.date)
            gamesByTeamAndDate[key] = game

            cursor.execute(insertGame.format(
                game.date, game.awayTeam.id, game.homeTeam.id,
                game.status, game.location,
                game.awayTeamRuns, game.awayTeamHits, game.awayTeamErrors, game.awayTeamHomeRuns,
                game.homeTeamRuns, game.homeTeamHits, game.homeTeamErrors, game.homeTeamHomeRuns)
            )

        # Retrieve the game IDs
        cursor.execute(selectGames.format(startDate, endDate))
        for row in cursor.fetchall():
            key = '{0}-{1}@{2:%Y-%m-%d %H:%M:%S}'.format(row[1], row[2], row[3])
            gamesByTeamAndDate[key].id = row[0]

        # Save inning data
        for game in games:
            inningNo = 1
            for inning in game.innings:
                cursor.execute(insertInning.format(
                    game.id, inningNo, inning.awayRuns, inning.homeRuns)
                )
                inningNo += 1

    # Update the last modified date
    cursor.execute("UPDATE t_meta SET last_modified = '{0}';".format(dataDate))

    cursor.close()
    connection.commit()

def tablesExist(connection):
    """Returns true if necessary tables and views appear to exist."""
    tablesNeeded = [
        't_meta'
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
        command = command.strip()
        if len(command) > 0:
            cursor.execute(command)

    cursor.close()
    connection.commit()

def updateDataForDate(connection, date, onlyIfNewer = True):
    #logger = logging.getLogger(__name__)
    #logger.info('Obtaining data for {:%Y-%m-%d}'.format(date.datetime.today()))
    print('Obtaining data for {:%Y-%m-%d}'.format(datetime.datetime.today()))

    apiUrl = getMLBApiUrlString(date)

    try:
        rawData = retrieveData(apiUrl)

        (dataDate, gameDate) = getDates(rawData)

        if (not onlyIfNewer) or dataIsNewer(connection, dataDate):
            (teams, games) = loadGameData(gameDate, rawData)

            saveData(connection, dataDate, teams, games)

            #logger.info('Update completed successfully.')
            print('Update completed successfully.')
        else:
            #logger.info('Data was already up-to-date.')
            print('Data was already up-to-date.')
    except urllib.error.URLError as e:
        #logger.error('Failed to obtain MLB API data: {0}'.format(e.reason))
        #logger.error("\tat: {0}".format(apiUrl))
        print('Failed to obtain MLB API data: {0}'.format(e.reason))
        print("\tat: {0}".format(apiUrl))
    except Exception as e:
        #logger.error(e.reason)
        print(e.reason)

if __name__ == '__main__':
    # logger = logging.getLogger(__name__)
    # logger.setLevel(logging.INFO)

    # logHandler = logging.FileHandler('logs/update_service.log')
    # logHandler.setLevel(logging.INFO)
    # logHandler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

    # logger.addHandler(logHandler)

    dbConfig = config.getConfig()

    try:
        connection = MySQLdb.connect(
            host = dbConfig['host'],
            user = dbConfig['username'],
            passwd = dbConfig['password'],
            db = dbConfig['database']
        )

        # Suppress MySQL warning messages raised when INSERT IGNORE runs into
        # duplicate keys
        warnings.filterwarnings('ignore', category = MySQLdb.Warning)

        if not tablesExist(connection):
            #logger.info('Tables and views do not exist; creating.')
            print('Tables and views do not exist; creating.')
            createTablesAndViews(connection)

        updateDataForDate(connection, datetime.datetime.today())

        connection.close()
    except MySQLdb.Error as e:
        #logger.error(str(e))
        print(str(e))
