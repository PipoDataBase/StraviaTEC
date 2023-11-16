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
    SELECT * FROM ActivityType where Id = @Id;
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
    SELECT * FROM Challenge where Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

Go
CREATE PROCEDURE spGetChallengeByManager
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
    SELECT * FROM Sportman where Username = @Username;
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
    WHERE Username = @Username;
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
    SELECT * FROM Nationality where Id = @Id;
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
    SELECT * FROM Activity;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spGetActivity
@Id int
AS
BEGIN
    SELECT * FROM Activity where Id = @Id;
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
    INSERT INTO Activity (Kilometers, Duration, Date, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @Description, @Username, NULL, NULL, @Type);
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
    INSERT INTO Activity (Kilometers, Duration, Date, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @Description, @Username, @RaceName, NULL, @Type);
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
    INSERT INTO Activity (Kilometers, Duration, Date, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @Description, @Username, NULL, @ChallengeName, @Type);
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
    INSERT INTO Activity (Kilometers, Duration, Date, Description, Username, RaceName, ChallengeName, Type)
    VALUES (@Kilometers, @Duration, @Date, @Description, @Username, @RaceName, @ChallengeName, @Type);
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
    SELECT * FROM Sponsor where TradeName = @TradeName;
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
    SELECT * FROM Group_ where Name = @Name;
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
    DELETE FROM Group_
    WHERE Name = @Name;
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
    SELECT * FROM Race where Name = @Name;
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
    @Type varchar(20),
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
    @Type varchar(20)
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
    SELECT * FROM Category where Id = @Id;
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
    SELECT * FROM BankAccount where RaceName = @RaceName;
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
    SELECT * FROM Bill where Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertBill
	@PhotoPath varchar(MAX),
	@Accepted bit,
	@Username varchar(20),
	@RaceName varchar(20)
AS
BEGIN
    INSERT INTO Bill (PhotoPath, Accepted, Username, RaceName)
    VALUES (@PhotoPath, @Accepted, @Username, @RaceName);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateBill
    @Id int,
	@PhotoPath varchar(MAX),
	@Accepted bit,
	@Username varchar(20),
	@RaceName varchar(20)
AS
BEGIN
    UPDATE Bill
    SET PhotoPath = @PhotoPath,
        Accepted = @Accepted,
        Username = @Username,
        RaceName = @RaceName
    WHERE Id = @Id;
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