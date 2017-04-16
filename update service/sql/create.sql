CREATE TABLE IF NOT EXISTS t_meta (
    last_modified DATETIME NOT NULL
);

INSERT INTO t_meta VALUES ('1970-01-01 00:00:00');

CREATE TABLE IF NOT EXISTS t_team (
    id INT NOT NULL AUTO_INCREMENT,
    abbr VARCHAR(8) NOT NULL,
    name VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (abbr),
    KEY (abbr)
);

CREATE TABLE IF NOT EXISTS t_game (
    away_id INT NOT NULL,
    home_id INT NOT NULL,
    game_date TIMESTAMP NOT NULL,
    status VARCHAR(64) NOT NULL,
    location VARCHAR(128) NOT NULL,
    away_runs INT NOT NULL,
    away_hits INT NOT NULL,
    away_errors INT NOT NULL,
    away_home_runs INT NOT NULL,
    home_runs INT NOT NULL,
    home_hits INT NOT NULL,
    home_errors INT NOT NULL,
    home_home_runs INT NOT NULL,
    PRIMARY KEY (home_id, away_id, game_date),
    FOREIGN KEY (home_id) REFERENCES t_team (id),
    FOREIGN KEY (away_id) REFERENCES t_team (id)
);

CREATE TABLE IF NOT EXISTS t_inning (
    away_id INT NOT NULL,
    home_id INT NOT NULL,
    game_date TIMESTAMP NOT NULL,
    inning_number INT NOT NULL,
    away_runs INT NULL,
    home_runs INT NULL,
    PRIMARY KEY (home_id, away_id, game_date, inning_number),
    FOREIGN KEY (home_id, away_id, game_date) REFERENCES t_game (home_id, away_id, game_date)
);

CREATE OR REPLACE VIEW team AS
SELECT
    abbr,
    name,
    city
FROM
    t_team;

CREATE OR REPLACE VIEW game AS
SELECT
    away.abbr AS away_team,
    home.abbr AS home_team,
    game_date,
    away.name AS away_name,
    away.city AS away_city,
    home.name AS home_name,
    home.city AS home_city,
    status,
    location,
    away_runs,
    away_hits,
    away_errors,
    away_home_runs,
    home_runs,
    home_hits,
    home_errors,
    home_home_runs
FROM
    t_game AS game
        INNER JOIN t_team AS away ON game.away_id = away.id
        INNER JOIN t_team AS home ON game.home_id = home.id;

CREATE OR REPLACE VIEW inning AS
SELECT
    away.abbr AS away_team,
    home.abbr AS home_team,
    game_date,
    inning_number,
    away.name AS away_name,
    away.city AS away_city,
    home.name AS home_name,
    home.city AS home_city,
    away_runs,
    home_runs
FROM
    t_inning AS inning
        INNER JOIN t_team AS away ON inning.away_id = away.id
        INNER JOIN t_team AS home ON inning.home_id = home.id;

/*
CREATE VIEW team_stats_by_month AS
SELECT
    team.abbr AS abbr,
    team.name AS name,
    team.city AS city,
    game_date,
    away_runs,
    away_home_runs
FROM
    t_team AS team
*/

/*
CREATE VIEW team_stats_by_year AS
SELECT
    team.abbr AS abbr,
    team.name AS name,
    team.city AS city,
    game_date,
    away_runs,
    away_home_runs
FROM
    t_team AS team
*/
