-- ================================================
--                      Race
-- ================================================

CREATE VIEW vwFutureRaces 
AS SELECT * FROM Race
WHERE GETDATE() < Race.Date;


-- ================================================
--                    Challenge
-- ================================================

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE VIEW vwAvailableChallenges
AS SELECT Challenge.Name, Challenge.Goal, Challenge.Private, Challenge.StartDate, Challenge.EndDate, Challenge.Deep, ActivityType.Type 
FROM Challenge INNER JOIN ActivityType
ON Challenge.Type = ActivityType.Id
WHERE GETDATE() < Challenge.EndDate;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE VIEW vwFutureChallenges
AS SELECT Challenge.Name, Challenge.Goal, Challenge.Private, Challenge.StartDate, Challenge.EndDate, Challenge.Deep, ActivityType.Type 
FROM Challenge INNER JOIN ActivityType
ON Challenge.Type = ActivityType.Id
WHERE  GETDATE() < Challenge.StartDate;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE VIEW vwActiveChallenges
AS SELECT Challenge.Name, Challenge.Goal, Challenge.Private, Challenge.StartDate, Challenge.EndDate, Challenge.Deep, ActivityType.Type 
FROM Challenge INNER JOIN ActivityType
ON Challenge.Type = ActivityType.Id
WHERE Challenge.StartDate < GETDATE() AND  GETDATE() < Challenge.EndDate;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE VIEW vwPastChallenges
AS SELECT Challenge.Name, Challenge.Goal, Challenge.Private, Challenge.StartDate, Challenge.EndDate, Challenge.Deep, ActivityType.Type 
FROM Challenge INNER JOIN ActivityType
ON Challenge.Type = ActivityType.Id
WHERE Challenge.EndDate < GETDATE();

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