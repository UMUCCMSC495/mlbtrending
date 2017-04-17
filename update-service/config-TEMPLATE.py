import os
from urllib.parse import urlparse

# Obtain database connection information from Heroku if possible
# See: https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-python-django
def getConfig():
    if 'DATABASE_URL' in os.environ:
        url = urlparse.urlparse(os.environ['DATABASE_URL'])
        config = {
            'host': url.hostname,
            'port': url.port,
            'username': url.username,
            'password': url.password,
            'database': url.path[1:]
        }
    else:
        config = {
            'host': 'localhost',
            'port': 3306,
            'username': 'DEFAULT_USERNAME',
            'password': 'DEFAULT_PASSWORD',
            'database': 'DEFAULT_DATABASE'
        }
    return config;
