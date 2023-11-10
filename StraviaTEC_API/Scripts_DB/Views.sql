-- ================================================
--                      Race
-- ================================================

CREATE VIEW vwFutureRaces 
AS
SELECT * FROM Race
WHERE GETDATE() < Race.Date;


-- ================================================
--                    Challenge
-- ================================================

Go
CREATE VIEW vwFutureChallenges
AS
SELECT * FROM Challenge
WHERE  GETDATE() < Challenge.StartDate;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE VIEW vwActiveChallenges
AS
SELECT * FROM Challenge
WHERE Challenge.StartDate < GETDATE() AND  GETDATE() < Challenge.EndDate;



CREATE VIEW vwSportmanNationality
AS SELECT Sportman.Username, Sportman.Name, Sportman.LastName1, Sportman.LastName2, Sportman.BirthDate, Sportman.PhotoPath, Nationality.Nationality AS Nationality
FROM Sportman INNER JOIN Nationality 
ON Sportman.Nationality = Nationality.Id;