-- ===============================================
--                    Sportmen
-- ================================================

Go
CREATE VIEW vwSportmanNationality
AS SELECT Sportman.Username, Sportman.Name, Sportman.LastName1, Sportman.LastName2, Sportman.BirthDate, Sportman.PhotoPath, Nationality.Nationality AS Nationality
FROM Sportman INNER JOIN Nationality 
ON Sportman.Nationality = Nationality.Id;

-- ================================================
--                      Race
-- ================================================

GO
CREATE VIEW vwRaces
AS SELECT R.Name, R.InscriptionPrice, R.Date, R.Private, R.RoutePath, AT.Type, RSM.Username AS Manager
FROM Race R 
INNER JOIN ActivityType AT ON R.Type = AT.Id
INNER JOIN RaceSportmanManager RSM ON R.Name = RSM.RaceName;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE FUNCTION FGetAge (@BirthDate DATE)
RETURNS INT
AS
BEGIN
    DECLARE @Age INT;

    SET @Age = DATEDIFF(YEAR, @BirthDate, GETDATE()) - 
        CASE WHEN FORMAT(GETDATE(), 'MMdd') < FORMAT(@BirthDate, 'MMdd') THEN 1 ELSE 0 END;

    RETURN @Age;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

/*
	wvRaceReportSportmanLeaderboard for sent model:

	CREATE VIEW wvRaceReportSportmanLeaderboard
AS SELECT S.Username, S.Name, S.LastName1, S.LastName2, dbo.FGetAge(S.BirthDate) AS Age, S.PhotoPath, S.Nationality, C.Category, A.Duration
FROM vwSportmanNationality S
INNER JOIN Bill B ON S.Username = B.Username AND B.Accepted = 1
INNER JOIN Category C ON B.CategoryId = C.Id
INNER JOIN Activity A ON B.RaceName = A.RaceName AND S.Username = A.Username
GROUP BY S.Username, S.Name, S.LastName1, S.LastName2, S.BirthDate, S.PhotoPath, S.Nationality, C.Category, A.Duration;

*/

GO 
CREATE VIEW wvRaceReportSportmanLeaderboard
AS SELECT S.Username, S.Name, S.LastName1, S.LastName2, dbo.FGetAge(S.BirthDate) AS Age, S.PhotoPath, S.Nationality, C.Category, A.Duration, A.RaceName
FROM vwSportmanNationality S
INNER JOIN Bill B ON S.Username = B.Username AND B.Accepted = 1
INNER JOIN Category C ON B.CategoryId = C.Id
INNER JOIN Activity A ON B.RaceName = A.RaceName AND S.Username = A.Username
GROUP BY  A.RaceName, C.Category, S.Username, S.Name, S.LastName1, S.LastName2, S.BirthDate, S.PhotoPath, S.Nationality, A.Duration;

-- Is not possible to order in views
-- ORDER BY A.RaceName, A.Duration ASC;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

/*
	vwRaceReportSportmanParticipant for sent model:

CREATE VIEW vwRaceReportSportmanParticipant 
AS SELECT S.Username, S.Name, S.LastName1, S.LastName2, dbo.FGetAge(S.BirthDate) AS Age, S.PhotoPath, S.Nationality, C.Category
FROM vwSportmanNationality S
INNER JOIN Bill B ON S.Username = B.Username AND B.Accepted = 1
INNER JOIN Category C ON B.CategoryId = C.Id
GROUP BY  C.Category, S.Username, S.Name, S.LastName1, S.LastName2, S.BirthDate, S.PhotoPath, S.Nationality;

*/

GO 
CREATE VIEW vwRaceReportSportmanParticipant 
AS SELECT S.Username, S.Name, S.LastName1, S.LastName2, dbo.FGetAge(S.BirthDate) AS Age, S.PhotoPath, S.Nationality, C.Category, B.RaceName
FROM vwSportmanNationality S
INNER JOIN Bill B ON S.Username = B.Username AND B.Accepted = 1
INNER JOIN Category C ON B.CategoryId = C.Id
GROUP BY  B.RaceName, C.Category, S.Username, S.Name, S.LastName1, S.LastName2, S.BirthDate, S.PhotoPath, S.Nationality;




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


-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE VIEW vwChallenges
AS SELECT C.Name, C.Goal, C.Private, C.StartDate, C.EndDate, C.Deep, AT.Type, CSM.SportmanUsername AS Manager, NULL AS Progress
FROM Challenge C 
INNER JOIN ActivityType AT ON C.Type = AT.Id
INNER JOIN ChallengeSportmanManager CSM ON C.Name = CSM.ChallengeName;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
