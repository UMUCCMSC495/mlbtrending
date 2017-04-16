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

if __name__ == '__main__':
    pass
