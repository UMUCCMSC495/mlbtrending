import unittest

import datetime

import update_service

class TestUpdateService(unittest.TestCase):
    def testDataIsNewer(self):
        class FakeCursor:
            def execute(self, query):
                pass

            def fetchone(self):
                ret = [ datetime.datetime(2017, 4, 4, 0, 0, 0) ]
                return ret

            def close(self):
                pass

        class FakeDatabaseConnection:
            def cursor(self):
                return FakeCursor()

        dataIsNewerDate = datetime.datetime(2017, 4, 5, 0, 0, 0)
        dataIsOlderDate = datetime.datetime(2017, 4, 3, 0, 0, 0)

        fakeConnection = FakeDatabaseConnection()

        self.assertTrue(update_service.dataIsNewer(fakeConnection, dataIsNewerDate))
        self.assertFalse(update_service.dataIsNewer(fakeConnection, dataIsOlderDate))

    def testGetDates(self):
        trueDataDate = datetime.datetime(2017, 2, 10, 0, 0, 0)
        trueGameDate = datetime.datetime(2016, 7, 24, 0, 0, 0)

        rawData = {
            'modified_date': '2017-02-10T19:44:57Z',
            'year': '2016',
            'month': '07',
            'day': '24'
        }

        (dataDate, gameDate) = update_service.getDates(rawData)

        dataDate = dataDate.replace(hour = 0, minute = 0, second = 0)

        self.assertEqual(trueDataDate, dataDate)
        self.assertEqual(trueGameDate, gameDate)

    def testGetOrdinal(self):
        testValues = {
            -20: '-20th',
            -1: '-1st',
            0: '0th',
            1: '1st',
            2: '2nd',
            3: '3rd',
            4: '4th',
            5: '5th',
            6: '6th',
            7: '7th',
            8: '8th',
            9: '9th',
            10: '10th',
            11: '11th',
            12: '12th',
            13: '13th',
            14: '14th',
            15: '15th',
            16: '16th',
            17: '17th',
            18: '18th',
            19: '19th',
            20: '20th',
            21: '21st',
            31: '31st',
            100: '100th',
            101: '101st',
            109: '109th',
            110: '110th',
            111: '111th'
        }

        for i, ordinal in testValues.items():
            self.assertEqual(ordinal, update_service.getOrdinal(i))

if __name__ == '__main__':
    unittest.main();
