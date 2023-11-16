-- ================================================
--                      Race
-- ================================================

GO
CREATE VIEW vwRaces
AS SELECT R.Name, R.InscriptionPrice, R.Date, R.Private, R.RoutePath, AT.Type, RSM.Username AS Manager
FROM Race R 
INNER JOIN ActivityType AT ON R.Type = AT.Id
INNER JOIN RaceSportmanManager RSM ON R.Name = RSM.RaceName;


-- ================================================
--                    Challenge
-- ================================================

Go
CREATE VIEW vwAvailableChallenges
AS SELECT Challenge.Name, Challenge.Goal, Challenge.Private, Challenge.StartDate, Challenge.EndDate, Challenge.Deep, ActivityType.Type 
FROM Challenge INNER JOIN ActivityType
ON Challenge.Type = ActivityType.Id
WHERE GETDATE() < Challenge.EndDate;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE VIEW vwChallengesByManager
AS SELECT Challenge.Name, Challenge.Goal, Challenge.Private, Challenge.StartDate, Challenge.EndDate, Challenge.Deep, Challenge.Type, ChallengeSportmanManager.SportmanUsername
FROM Challenge 
INNER JOIN ChallengeSportmanManager ON Challenge.Name = ChallengeSportmanManager.ChallengeName;

-- ================================================
--                    Sportmen
-- ================================================

Go
CREATE VIEW vwSportmanNationality
AS SELECT Sportman.Username, Sportman.Name, Sportman.LastName1, Sportman.LastName2, Sportman.BirthDate, Sportman.PhotoPath, Nationality.Nationality AS Nationality
FROM Sportman INNER JOIN Nationality 
ON Sportman.Nationality = Nationality.Id;