-- ================================================
--                  ActivityType
-- ================================================
CREATE PROCEDURE spGetActivityTypes
AS
BEGIN
    SELECT * FROM ActivityType;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spGetActivityType
@Id tinyint
AS
BEGIN
    SELECT * FROM ActivityType WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertActivityType
    @Type varchar(20)
AS
BEGIN
    INSERT INTO ActivityType (Type)
    VALUES (@Type);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateActivityType
    @Id tinyint,
    @Type varchar(20)
AS
BEGIN
    UPDATE ActivityType
    SET Type= @Type
    WHERE Id=@Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteActivityType
    @Id tinyint
AS
BEGIN
    DELETE FROM ActivityType
    WHERE Id = @Id;
END;

Go
-- ================================================
--                  Challenge
-- ================================================
CREATE PROCEDURE spGetChallenges
AS
BEGIN
    SELECT * FROM Challenge;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spGetChallenge
@Name varchar(20)
AS
BEGIN
    SELECT * FROM Challenge WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>


GO
CREATE FUNCTION FGetProgress (@Username varchar(20), @ChallengeName varchar(20))
RETURNS tinyint
AS
BEGIN
    DECLARE @CompletedKm numeric(12,3);
    DECLARE @GoalKm numeric(12,3);
    DECLARE @Progress tinyint;
    -- Gets User Activities related to the 
    -- challenge and sums its kilometers
    SELECT @CompletedKm = SUM(Kilometers)
    FROM (SELECT Kilometers 
          FROM Activity 
          WHERE Username = @Username 
          AND ChallengeName = @ChallengeName) 
          AS Activities;
    -- Gets the Goal Kilometers from the challenge
    SELECT @GoalKm = Goal
    FROM (SELECT Goal
          FROM Challenge
          WHERE Name = @ChallengeName)
          AS Challenge;
    -- Validates data and calculates progress
    IF (@CompletedKm = 0 OR @CompletedKm IS NULL OR @CompletedKm IS NULL)
        BEGIN
            SET @Progress = 0;
        END
    IF @GoalKm < @CompletedKm
	    BEGIN
		    SET @Progress = 100
	    END
    ELSE
        BEGIN
            SET @Progress = (@CompletedKm/@GoalKm * 100);
		    IF @Progress IS NULL
			    BEGIN 
				    SET @Progress = 0
			    END
        END
    RETURN @Progress;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetAvailableVwChallenges
    @Username varchar(20)
AS
BEGIN
    SELECT C.Name, C.Goal, C.Private, C.StartDate, C.EndDate, C.Deep, C.Type, C.Manager, dbo.FGetProgress(@Username, C.Name) AS Progress
    FROM vwChallenges C
    LEFT JOIN ChallengeGroup CG ON C.Name = CG.ChallengeName
    LEFT JOIN SportmanGroup SG ON SG.GroupName = CG.GroupName
    WHERE GETDATE() < EndDate AND (Private = 0 OR SG.Username = @Username);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetChallengesByManager
@Username varchar(20)
AS
BEGIN
    SELECT Name, Goal, Private, StartDate, EndDate, Deep, Type
    FROM vwChallengesByManager
    WHERE SportmanUsername = @Username;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetChallengeSponsors
    @ChallengeName varchar(20)
AS
BEGIN 
    SELECT S.TradeName, S.LegalRepresentant, S.Phone, S.LogoPath
    FROM Sponsor S INNER JOIN ChallengeSponsor CS
    ON S.TradeName = CS.SponsorTradeName
    WHERE ChallengeName = @ChallengeName
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetChallengeProgress
    @Username varchar(20),
    @ChallengeName varchar(20)
AS
BEGIN
    DECLARE @CompletedKm numeric(12,3);
    DECLARE @GoalKm numeric(12,3);
    DECLARE @Progress tinyint;
    -- Gets User Activities related to the 
    -- challenge and sums its kilometers
    SELECT @CompletedKm = SUM(Kilometers)
    FROM (SELECT Kilometers 
          FROM Activity 
          WHERE Username = @Username 
          AND ChallengeName = @ChallengeName) 
          AS Activities;
    -- Gets the Goal Kilometers from the challenge
    SELECT @GoalKm = Goal
    FROM (SELECT Goal
          FROM Challenge
          WHERE Name = @ChallengeName)
          AS Challenge;
    -- Validates data and calculates progress
    IF (@CompletedKm = 0 OR @CompletedKm IS NULL OR @CompletedKm IS NULL)
        BEGIN
            SET @Progress = 0;
        END
    IF @GoalKm < @CompletedKm
	    BEGIN
		    SET @Progress = 100
	    END
    ELSE
        BEGIN
            SET @Progress = (@CompletedKm/@GoalKm * 100);
		    IF @Progress IS NULL
			    BEGIN 
				    SET @Progress = 0
			    END
        END
    SELECT C.Name, C.Goal, C.Private, C.StartDate, C.EndDate, C.Deep, C.Type, C.Manager, @Progress AS Progress
    FROM vwChallenges C
    WHERE C.Name = @ChallengeName;
END;


-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertChallenge
    @Name varchar(20),
    @Goal numeric(12,3),
    @Private bit,
    @StartDate DATETIME,
    @EndDate DATETIME,
    @Deep bit,
    @Type tinyint,
    @ManagerUsername varchar(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Sportman WHERE Username = @ManagerUsername)
        BEGIN
            PRINT 'Error inserting Challenge: Sportman username doesnt exists';
            THROW 51000, 'ERROR: The given Sportman doesnt exists', 1;
        END
    IF EXISTS (SELECT 1 FROM Challenge WHERE Name = @Name)
        BEGIN
            PRINT 'Error inserting Challenge: Challenge name is taken';
            THROW 51000, 'ERROR: Challenge name is taken', 1;
        END
    ELSE
        BEGIN TRY
            INSERT INTO Challenge (Name, Goal, Private, StartDate, EndDate, Deep, Type)
            VALUES (@Name, @Goal, @Private, @StartDate, @EndDate, @Deep, @Type);
            INSERT INTO ChallengeSportmanManager (ChallengeName, SportmanUsername)
            VALUES (@Name, @ManagerUsername);
            RETURN;
        END TRY
        BEGIN CATCH
            PRINT 'Error inserting Challenge ' + ERROR_MESSAGE();
            THROW 51000, 'Error inserting Challenge', 1;
        END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddChallengeSponsor
    @SponsorTradeName varchar(20),
    @ChallengeName varchar(20)
AS
BEGIN
    BEGIN TRY
        INSERT INTO ChallengeSponsor (SponsorTradeName, ChallengeName)
        VALUES (@SponsorTradeName, @ChallengeName);
        RETURN;
    END TRY
    BEGIN CATCH
        PRINT 'Error adding Challenge Sponsor ' + ERROR_MESSAGE();
        THROW 51000, 'Error adding ChallengeSponsor', 1;
    END CATCH;
END

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spUpdateChallenge
    @Name varchar(20),
    @Goal numeric(12,3),
    @Private bit,
    @StartDate DATETIME,
    @EndDate DATETIME,
    @Deep bit,
    @Type tinyint
AS
BEGIN
    UPDATE Challenge
    SET Goal = @Goal,
        Private = @Private,
        StartDate = @StartDate,
        EndDate = @EndDate,
        Deep = @Deep,
        Type = @Type
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteChallenge
    @Name varchar(20)
AS
BEGIN
	DELETE FROM ChallengeSportmanManager
	WHERE ChallengeName = @Name;
	DELETE FROM ChallengeSponsor
	WHERE ChallengeName = @Name;
    DELETE FROM Challenge
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteChallengeSponsors
    @ChallengeName varchar(20)
AS
BEGIN
	DELETE FROM ChallengeSponsor
	WHERE ChallengeName = @ChallengeName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetChallengeParticipants
    @ChallengeName varchar(20)
AS
BEGIN
    SELECT VwS.Username, VwS.Name, VwS.LastName1, VwS.LastName2, 
           VwS.BirthDate, VwS.PhotoPath, VwS.Nationality
    FROM vwSportmanNationality VwS INNER JOIN ChallengeSportmanParticipant CSP 
    ON VwS.Username = CSP.SportmanUsername
    WHERE CSP.ChallengeName = @ChallengeName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
-- ================================================
--                  Sportman
-- ================================================
CREATE PROCEDURE spGetSportmen
AS
BEGIN
    SELECT * FROM Sportman;
END;

Go
-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetSportman
@Username varchar(20)
AS
BEGIN
    SELECT * FROM Sportman WHERE Username = @Username;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetSportmenNationView
AS
BEGIN
    SELECT * FROM vwSportmanNationality;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetSportmanNationView
    @Username varchar(20)
AS
BEGIN
    SELECT * FROM vwSportmanNationality 
    WHERE Username LIKE '%' + @Username + '%';
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spLogin
    @Username varchar (20),
    @Password varchar (20)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Sportman WHERE Username = @Username AND Password = @Password)
        RETURN;
    IF EXISTS (SELECT 1 FROM Sportman WHERE Username = @Username)
        THROW 51000, 'ERROR: wrong password', 1;
    ELSE
        THROW 51000, 'ERROR: the given username doesnt exists', 1;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go

CREATE PROCEDURE spInsertSportman
	@Username varchar(20) ,
	@Name varchar(20),
	@LastName1 varchar(20),
	@LastName2 varchar(20),
	@BirthDate DATE,
	@PhotoPath varchar(MAX),
	@Password varchar(20) ,
	@Nationality tinyint
AS
BEGIN
    INSERT INTO Sportman (Username, Name, LastName1, LastName2, BirthDate, PhotoPath, Password, Nationality)
    VALUES (@Username, @Name, @LastName1, @LastName2, @BirthDate, @PhotoPath, @Password, @Nationality);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateSportman
	@Username varchar(20) ,
	@Name varchar(20),
	@LastName1 varchar(20),
	@LastName2 varchar(20),
	@BirthDate DATE,
	@PhotoPath varchar(MAX),
	@Password varchar(20) ,
	@Nationality tinyint
AS
BEGIN
    UPDATE Sportman
    SET Name = @Name,
        LastName1 = @LastName1,
        LastName2 = @LastName2,
        BirthDate = @Birthdate,
        PhotoPath = @PhotoPath,
        Password = @Password,
        Nationality = @Nationality
    WHERE Username = @Username;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteSportman
    @Username varchar(20)
AS
BEGIN
    DELETE FROM Sportman
    WHERE Username = @Username;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddChallengeSportmanParticipant
    @ChallengeName varchar(20),
	@SportmanUsername varchar(20)
AS
BEGIN
    BEGIN TRY
        INSERT INTO ChallengeSportmanParticipant (ChallengeName, SportmanUsername)
        VALUES (@ChallengeName, @SportmanUsername);
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR: couldnt add the Sportman to the Challenge', 1;
    END CATCH
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO 
CREATE PROCEDURE spDeleteChallengeSportmanParticipant
    @ChallengeName varchar(20),
	@SportmanUsername varchar(20)
AS
BEGIN
    BEGIN TRY
        DELETE FROM ChallengeSportmanParticipant 
        WHERE ChallengeName = @ChallengeName AND SportmanUsername = @SportmanUsername
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR leaving Challenge', 1;
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO 
CREATE PROCEDURE spDeleteSportmanGroup
    @Username varchar(20),
	@GroupName varchar(20)
AS
BEGIN
    BEGIN TRY
        DELETE FROM SportmanGroup 
        WHERE Username = @Username AND GroupName = @GroupName
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR leaving Group', 1;
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO 
CREATE PROCEDURE spDeleteFriend
    @Username varchar(20),
	@FriendName varchar(20)
AS
BEGIN
    BEGIN TRY
        DELETE FROM Friend 
        WHERE Username = @Username AND FriendUsername = @FriendName
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR trying to unfollow', 1;
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetSportmanChallenges
    @Username varchar(20)
AS
BEGIN
    SELECT C.Name, C.Goal, C.Private, C.StartDate, C.EndDate, C.Deep, C.Type
    FROM Challenge C INNER JOIN ChallengeSportmanParticipant CSP
    ON C.Name = CSP.ChallengeName
    WHERE CSP.SportmanUsername = @Username;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddFriend
    @Username varchar(20),
    @FriendUsername varchar(20)
AS
BEGIN
    BEGIN TRY
        INSERT INTO Friend (Username, FriendUsername)
        VALUES (@Username, @FriendUsername)
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR: couldnt add friend', 1;
    END CATCH
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetFriends
    @Username varchar(20)
AS 
BEGIN
    SELECT S.Username, S.Name, S.LastName1, S.LastName2, S.BirthDate, S.PhotoPath, S.Nationality
    FROM vwSportmanNationality S INNER JOIN Friend F
    ON S.Username = F.FriendUsername
    WHERE F.Username = @Username 
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddToGroup
    @Username varchar(20),
    @GroupName varchar(20)
AS
BEGIN
    BEGIN TRY
        INSERT INTO SportmanGroup(Username, GroupName)
        VALUES (@Username, @GroupName)
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR: couldnt join group', 1;
    END CATCH
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetParticipatingGroups
    @Username varchar(20)
AS
BEGIN
    SELECT G.Name 
    FROM Group_ G INNER JOIN SportmanGroup SG
    ON G.Name = SG.GroupName
    WHERE SG.Username = @Username;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetJoinedRaces
    @Username varchar(20)
AS
BEGIN
    SELECT vwR.Name, vwR.InscriptionPrice, vwR.Date, vwR.Private, vwR.RoutePath, vwR.Type, vwR.Manager 
    FROM vwRaces vwR INNER JOIN Bill B
    ON vwR.Name = B.RaceName
    WHERE B.Username = @Username AND B.Accepted = 1;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetRaceReportSportmanLeaderboard
    @RaceName varchar(20)
AS
BEGIN
    SELECT Username, Name, LastName1, LastName2, Age, PhotoPath, Nationality, Category, Duration
    FROM wvRaceReportSportmanLeaderboard
    WHERE RaceName = @RaceName
    ORDER BY Category, Duration ASC
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetRaceReportSportmanParticipant
    @RaceName varchar(20)
AS
BEGIN
    SELECT Username, Name, LastName1, LastName2, Age, PhotoPath, Nationality, Category
    FROM vwRaceReportSportmanParticipant
    WHERE RaceName = @RaceName
    ORDER BY Category ASC
END;


-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
-- ================================================
--                  Nationality
-- ================================================
CREATE PROCEDURE spGetNationalities
AS
BEGIN
    SELECT * FROM Nationality;
END;

Go
-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetNationality
    @Id tinyint
AS
BEGIN
    SELECT * FROM Nationality WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go

CREATE PROCEDURE spInsertNationality
	@Nationality varchar(20)
AS
BEGIN
    INSERT INTO Nationality (Nationality)
    VALUES (@Nationality);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateNationality
	@Id tinyint,
	@Nationality varchar(20)
AS
BEGIN
    UPDATE Nationality
    SET Nationality = @Nationality
    WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteNationality
    @Id tinyint
AS
BEGIN
    DELETE FROM Nationality
    WHERE Id = @Id;
END;

Go
-- ================================================
--                  Activity
-- ================================================
CREATE PROCEDURE spGetActivities
AS
BEGIN
    SELECT * FROM Activity
	ORDER BY Date DESC;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spGetActivity
@Id int
AS
BEGIN
    SELECT * FROM Activity WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertActivity
	@Kilometers numeric(10,3),
	@Duration time(0) NULL,
	@Date DATETIME,
	@RoutePath varchar(MAX),
	@Description varchar(40) NULL,
	@Username varchar(20),
	@Type tinyint
AS
BEGIN
    INSERT INTO Activity (Kilometers, Duration, Date, RoutePath, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, NULL, NULL, @Type);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertActivityRace
	@Kilometers numeric(10,3),
	@Duration time(0) NULL,
	@Date DATETIME,
	@RoutePath varchar(MAX),
	@Description varchar(40) NULL,
	@Username varchar(20),
	@RaceName varchar(20) NULL,
	@Type tinyint
AS
BEGIN
    INSERT INTO Activity (Kilometers, Duration, Date, RoutePath, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @RaceName, NULL, @Type);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertActivityChallenge
	@Kilometers numeric(10,3),
	@Duration time(0) NULL,
	@Date DATETIME,
	@RoutePath varchar(MAX),
	@Description varchar(40) NULL,
	@Username varchar(20),
	@ChallengeName varchar(20) NULL,
	@Type tinyint
AS
BEGIN
    INSERT INTO Activity (Kilometers, Duration, Date, RoutePath, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, NULL, @ChallengeName, @Type);
END;
-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertActivityChallengeAndRace
	@Kilometers numeric(10,3),
	@Duration time(0) NULL,
	@Date DATETIME,
	@RoutePath varchar(MAX),
	@Description varchar(40) NULL,
	@Username varchar(20),
    @RaceName varchar(20) NULL,
	@ChallengeName varchar(20) NULL,
	@Type tinyint
AS
BEGIN
    INSERT INTO Activity (Kilometers, Duration, Date, RoutePath, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @RaceName, @ChallengeName, @Type);
END;
-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateActivity
    @Id int,
	@Kilometers numeric(10,3),
	@Duration time(0) NULL,
	@Date DATETIME,
	@RoutePath varchar(MAX),
	@Description varchar(40) NULL,
	@Username varchar(20),
	@RaceName varchar(20) NULL,
	@ChallengeName varchar(20) NULL,
	@Type tinyint
AS
BEGIN
    UPDATE Activity
    SET Kilometers = @Kilometers,
        Duration = @Duration,
        Date = @Date,
        RoutePath = @RoutePath,
        Description = @Description,
        Username = @Username,
        RaceName = @RaceName,
        ChallengeName = @ChallengeName,
        Type = @Type
    WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteActivity
    @Id int
AS
BEGIN
    DELETE FROM Activity
    WHERE Id = @Id;
END;
-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
-- ================================================
--                  Sponsor
-- ================================================
CREATE PROCEDURE spGetSponsors
AS
BEGIN
    SELECT * FROM Sponsor;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spGetSponsor
@TradeName varchar(20)
AS
BEGIN
    SELECT * FROM Sponsor WHERE TradeName = @TradeName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertSponsor
    @TradeName varchar(20),
	@LegalRepresentant varchar(20),
	@Phone numeric(8,0),
	@LogoPath varchar(MAX)
AS
BEGIN
    INSERT INTO Sponsor (TradeName, LegalRepresentant, Phone, LogoPath)
    VALUES (@TradeName, @LegalRepresentant, @Phone, @LogoPath);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateSponsor
    @TradeName varchar(20),
	@LegalRepresentant varchar(20),
	@Phone numeric(8,0),
	@LogoPath varchar(MAX)
AS
BEGIN
    UPDATE Sponsor
    SET LegalRepresentant = @LegalRepresentant,
        Phone = @Phone,
        LogoPath = @LogoPath
    WHERE TradeName = @TradeName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteSponsor
    @TradeName varchar(20)
AS
BEGIN
    DELETE FROM Sponsor
    WHERE TradeName = @TradeName;
END;

Go
-- ================================================
--                  Group_
-- ================================================
CREATE PROCEDURE spGetGroups
AS
BEGIN
    SELECT * FROM Group_;
END;

Go
-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetGroup
    @Name varchar(20)
AS
BEGIN
    SELECT * FROM Group_ WHERE Name LIKE '%' + @Name + '%';
END;

Go
-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetGroupsByManager
    @Username varchar(20)
AS
BEGIN
    SELECT G.Name 
    FROM Group_ G INNER JOIN GroupManager GM
    ON G.Name = GM.GroupName
    WHERE GM.Username = @Username;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetGroupMembers
    @GroupName varchar(20)
AS
BEGIN
    SELECT S.Username, S.Name, S.LastName1, S.LastName2, S.BirthDate, S.PhotoPath, S.Nationality
    FROM vwSportmanNationality S INNER JOIN SportmanGroup SG
    ON S.Username = SG.Username
    WHERE SG.GroupName = @GroupName;
END;


-- <><><><><><><><><><><><><><><><><><><><><><><><>
-- Checks if the user exists and the name isnt taken. Then creates the group and sets its manager
Go
CREATE PROCEDURE spInsertGroup
	@Name varchar(20),
    @ManagerUsername varchar(20)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Sportman WHERE Username = @ManagerUsername) AND NOT EXISTS (SELECT 1 FROM Group_ WHERE Name = @Name)
        BEGIN TRY
            INSERT INTO Group_ (Name)
            VALUES (@Name);
            INSERT INTO GroupManager (Username, GroupName)
            VALUES (@ManagerUsername, @Name);
            RETURN;
        END TRY
        BEGIN CATCH
            PRINT 'Error inserting group ' + ERROR_MESSAGE();
        END CATCH;
    ELSE
        PRINT 'Error inserting group';
        THROW 51000, 'ERROR: Username not exists or Name is taken', 1; 
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddChallengeGroup
    @ChallengeName varchar(20),
    @GroupName varchar(20)
AS
BEGIN 
    BEGIN TRY
        INSERT INTO ChallengeGroup (ChallengeName, GroupName)
        VALUES (@ChallengeName, @GroupName)
    END TRY 
    BEGIN CATCH
        THROW 51000, 'ERROR: couldnt Add ChallengeGroup', 1; 
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddRaceGroup
    @RaceName varchar(20),
    @GroupName varchar(20)
AS
BEGIN 
    BEGIN TRY
        INSERT INTO RaceGroup (RaceName, GroupName)
        VALUES (@RaceName, @GroupName)
    END TRY 
    BEGIN CATCH
        THROW 51000, 'ERROR: couldnt Add RaceGroup', 1; 
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
-- Si quiero implementar bien el updated; crear nueva tabla, migrar relaciones y eliminar esta tabla
Go
CREATE PROCEDURE spUpdateGroup
	@Name varchar(20),
    @NewName varchar(20)
AS
BEGIN
    UPDATE Group_
    SET Name = @NewName
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteGroup
    @Name varchar(20)
AS
BEGIN
	DELETE FROM GroupManager
	WHERE GroupName = @Name;
    DELETE FROM Group_
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spDeleteChallengeGroup
    @ChallengeName varchar(20),
    @GroupName varchar(20)
AS 
BEGIN
    BEGIN TRY
        DELETE FROM ChallengeGroup WHERE ChallengeName = @ChallengeName AND GroupName = @GroupName
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR deleting ChallengeGroup', 1; 
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spDeleteRaceGroup
    @RaceName varchar(20),
    @GroupName varchar(20)
AS 
BEGIN
    BEGIN TRY
        DELETE FROM RaceGroup WHERE RaceName = @RaceName AND GroupName = @GroupName
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR deleting RaceGroup', 1; 
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>


Go
-- ================================================
--                  Race
-- ================================================
CREATE PROCEDURE spGetRaces
AS
BEGIN
    SELECT * FROM Race;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetAvailableVwRaces
    @Username varchar(20)
AS
BEGIN
    SELECT DISTINCT R.Name, R.InscriptionPrice, R.Date, R.Private, R.RoutePath, R.Type, R.Manager 
    FROM vwRaces R
    LEFT JOIN RaceGroup RG ON R.Name = RG.RaceName
    LEFT JOIN SportmanGroup SG ON SG.GroupName = RG.GroupName
    WHERE GETDATE() < Date AND (Private = 0 OR SG.Username = @Username);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetAllRaces
    @Username varchar(20)
AS
BEGIN
    SELECT DISTINCT R.Name, R.InscriptionPrice, R.Date, R.Private, R.RoutePath, R.Type, R.Manager 
    FROM vwRaces R
    LEFT JOIN RaceGroup RG ON R.Name = RG.RaceName
    LEFT JOIN SportmanGroup SG ON SG.GroupName = RG.GroupName
    WHERE (Private = 0 OR SG.Username = @Username);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetRacesByManager
    @Username varchar(20)
AS
BEGIN
    SELECT R.Name, R.InscriptionPrice, R.Date, R.Private, R.RoutePath, R.Type
    FROM Race R INNER JOIN RaceSportmanManager RS
    ON R.Name = RS.RaceName
    WHERE RS.Username = @Username
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetRaceCategories
    @RaceName varchar(20)
AS
BEGIN
    SELECT C.Id , C.MinimumAge, C.MaximumAge, C.Category
    FROM Category C INNER JOIN RaceCategory RC
    ON C.Id = RC.CategoryId
    WHERE RC.RaceName = @RaceName
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetRaceGroups
    @RaceName varchar(20)
AS
BEGIN
    SELECT G.Name
    FROM Group_ G INNER JOIN RaceGroup RG
    ON G.Name = RG.GroupName
    WHERE RG.RaceName = @RaceName
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetRaceSponsors
    @RaceName varchar(20)
AS
BEGIN 
    SELECT S.TradeName, S.LegalRepresentant, S.Phone, S.LogoPath
    FROM Sponsor S INNER JOIN RaceSponsor RS
    ON S.TradeName = RS.SponsorTradeName
    WHERE RaceName = @RaceName
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetRace
    @Name varchar(20)
AS
BEGIN
    SELECT * FROM Race WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spGetRaceBankAccounts
    @RaceName varchar(20)
AS
BEGIN
    SELECT * FROM BankAccount WHERE RaceName = @RaceName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spInsertRace
    @Name varchar(20),
	@InscriptionPrice numeric(6,0),
	@Date DATETIME,
	@Private bit,
	@RoutePath varchar(MAX),
    @Type tinyint,
    @ManagerUsername varchar(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Sportman WHERE Username = @ManagerUsername)
        BEGIN
            PRINT 'Error inserting Race: Sportman username doesnt exists';
            THROW 51000, 'ERROR: The given Sportman doesnt exists', 1;
        END
    IF EXISTS (SELECT 1 FROM Race WHERE Name = @Name)
        BEGIN
            PRINT 'Error inserting Race: race name is taken';
            THROW 51000, 'ERROR: Race name is taken', 1;
        END
    ELSE
        BEGIN TRY
            INSERT INTO Race (Name, InscriptionPrice, Date, Private, RoutePath, Type)
            VALUES (@Name, @InscriptionPrice, @Date, @Private, @RoutePath, @Type);
            INSERT INTO RaceSportmanManager (Username, RaceName)
            VALUES (@ManagerUsername, @Name);
            RETURN;
        END TRY
        BEGIN CATCH
            PRINT 'Error inserting Race ' + ERROR_MESSAGE();
            THROW 51000, 'Error inserting Race', 1;
        END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddRaceCategory
    @RaceName varchar(20),
    @CategoryId tinyint
AS 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Race WHERE Name = @RaceName)
        BEGIN
            PRINT 'Error Adding RaceCategory: RaceName doesnt exists';
            THROW 51000, 'ERROR: The given RaceName doesnt exists', 1;
        END
    IF NOT EXISTS (SELECT 1 FROM Category WHERE Id = @CategoryId)
        BEGIN
            PRINT 'Error Adding RaceCategory: Category doesnt exists';
            THROW 51000, 'ERROR: The given Id doesnt exists', 1;
        END
    ELSE
        BEGIN TRY
            INSERT INTO RaceCategory (RaceName, CategoryId)
            VALUES (@RaceName, @CategoryId);
            RETURN;
        END TRY
        BEGIN CATCH
            PRINT 'Error adding RaceCategory ' + ERROR_MESSAGE();
            THROW 51000, 'Error adding RaceCategory', 1;
        END CATCH;
END;


-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAddRaceSponsor
    @SponsorTradeName varchar(20),
    @RaceName varchar(20)
AS
BEGIN
    BEGIN TRY
        INSERT INTO RaceSponsor (SponsorTradeName, RaceName)
        VALUES (@SponsorTradeName, @RaceName);
        RETURN;
    END TRY
    BEGIN CATCH
        PRINT 'Error adding RaceSponsor ' + ERROR_MESSAGE();
        THROW 51000, 'Error adding RaceSponsor', 1;
    END CATCH;
END

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spUpdateRace
    @Name varchar(20),
	@InscriptionPrice numeric(6,0),
	@Date DATETIME,
	@Private bit,
	@RoutePath varchar(MAX),
    @Type tinyint
AS
BEGIN
    UPDATE Race
    SET InscriptionPrice = @InscriptionPrice,
        Date = @Date,
        Private = @Private,
        RoutePath = @RoutePath,
        Type = @Type
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteRace
    @Name varchar(20)
AS
BEGIN
	DELETE FROM RaceSportmanManager
	WHERE RaceName = @Name;
	DELETE FROM RaceCategory
	WHERE RaceName = @Name;
	DELETE FROM RaceGroup
	WHERE RaceName = @Name;
	DELETE FROM RaceSponsor
	WHERE RaceName = @Name;
	DELETE FROM BankAccount
	WHERE RaceName = @Name;
    DELETE FROM Race
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteRaceCategories
    @RaceName varchar(20)
AS
BEGIN
	DELETE FROM RaceCategory
	WHERE RaceName = @RaceName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteRaceGroups
    @RaceName varchar(20)
AS
BEGIN
	DELETE FROM RaceGroup
	WHERE RaceName = @RaceName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteRaceSponsors
    @RaceName varchar(20)
AS
BEGIN
	DELETE FROM RaceSponsor
	WHERE RaceName = @RaceName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
-- ================================================
--                  Category
-- ================================================
CREATE PROCEDURE spGetCategories
AS
BEGIN
    SELECT * FROM Category;
END;

Go
-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetCategory
    @Id tinyint
AS
BEGIN
    SELECT * FROM Category WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go

CREATE PROCEDURE spInsertCategory
	@MinimumAge tinyint,
    @MaximumAge tinyint,
    @Category varchar(20)
AS
BEGIN
    INSERT INTO Category (MinimumAge, MaximumAge, Category)
    VALUES (@MinimumAge, @MaximumAge, @Category);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateCategory
	@Id tinyint,
	@MinimumAge tinyint,
    @MaximumAge tinyint,
    @Category varchar(20)
AS
BEGIN
    UPDATE Category
    SET MinimumAge = @MinimumAge,
        MaximumAge = @MaximumAge,
        Category = @Category
    WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteCategory
    @Id tinyint
AS
BEGIN
    DELETE FROM Category
    WHERE Id = @Id;
END;
-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
-- ================================================
--                  BankAccount
-- ================================================
CREATE PROCEDURE spGetBankAccounts
AS
BEGIN
    SELECT * FROM BankAccount;
END;

Go
-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetBankAccount
    @RaceName varchar(20)
AS
BEGIN
    SELECT * FROM BankAccount WHERE RaceName = @RaceName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertBankAccount
	@BankAccount varchar(22),
	@RaceName varchar(20)
AS
BEGIN
    INSERT INTO BankAccount (BankAccount, RaceName)
    VALUES (@BankAccount, @RaceName);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spUpdateBankAccount
	@BankAccount varchar(22),
	@RaceName varchar(20),
    @NewBankAccount varchar(22)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE BankAccount
        SET BankAccount = @NewBankAccount
        WHERE BankAccount = @BankAccount AND RaceName = @RaceName;
        COMMIT;
        RETURN;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        PRINT 'BankAccount Update Failed';
        THROW 51000, 'ERROR: BankAccount Update Failed', 1;
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spDeleteBankAccount
    @BankAccount varchar(22),
	@RaceName varchar(20)
AS
BEGIN
    DELETE FROM BankAccount
    WHERE BankAccount = @BankAccount AND RaceName = @RaceName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
-- ================================================
--                  Bill
-- ================================================
CREATE PROCEDURE spGetBills
AS
BEGIN
    SELECT * FROM Bill;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spGetBill
@Id INT
AS
BEGIN
    SELECT * FROM Bill WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetBillToDelete
@Username varchar(20),
@RaceName varchar(20)
AS
BEGIN
    SELECT * FROM Bill WHERE Username = @Username AND RaceName = @RaceName;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertBill
	@PhotoPath varchar(MAX),
	@Username varchar(20),
	@RaceName varchar(20),
    @CategoryId tinyint
AS
BEGIN
    BEGIN TRY
        INSERT INTO Bill (PhotoPath, Username, RaceName, CategoryId)
        VALUES (@PhotoPath, @Username, @RaceName, @CategoryId );
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR: Couldnt Insert Bill', 1;
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateBill
    @Id int,
	@PhotoPath varchar(MAX),
	@Accepted bit,
	@Username varchar(20),
	@RaceName varchar(20),
    @CategoryId tinyint
AS
BEGIN
    UPDATE Bill
    SET PhotoPath = @PhotoPath,
        Accepted = @Accepted,
        Username = @Username,
        RaceName = @RaceName,
        CategoryId = @CategoryId
    WHERE Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

GO
CREATE PROCEDURE spAcceptBill
    @Id int
AS
BEGIN
    BEGIN TRY 
        UPDATE Bill
        SET Accepted = 1
        WHERE Id = @Id;
    END TRY
    BEGIN CATCH
        THROW 51000, 'ERROR: Couldnt accept Bill', 1;
    END CATCH;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spDeleteBill
    @Id int
AS
BEGIN
    DELETE FROM Bill
    WHERE Id = @Id;
END;