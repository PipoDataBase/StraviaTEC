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
CREATE PROCEDURE spInsertChallenge
    @Name varchar(20),
    @Goal numeric(12,3),
    @Private bit,
    @StartDate DATETIME,
    @EndDate DATETIME,
    @Deep bit,
    @Type tinyint
AS
BEGIN
    INSERT INTO Challenge (Name, Goal, Private, StartDate, EndDate, Deep, Type)
    VALUES (@Name, @Goal, @Private, @StartDate, @EndDate, @Deep, @Type);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
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
    DELETE FROM Challenge
    WHERE Name = @Name;
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
--                  Group
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
Go
CREATE PROCEDURE spInsertGroup
	@Name varchar(20)
AS
BEGIN
    INSERT INTO Group_ (Name)
    VALUES (@Name);
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
CREATE PROCEDURE spGetRace
    @Name varchar(20)
AS
BEGIN
    SELECT * FROM Race where Name = @Name;
END;
-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spInsertRace
    @Name varchar(20),
	@InscriptionPrice numeric(6,0),
	@Date DATETIME,
	@Private bit,
	@RoutePath varchar(MAX)
AS
BEGIN
    INSERT INTO Race (Name, InscriptionPrice, Date, Private, RoutePath)
    VALUES (@Name, @InscriptionPrice, @Date, @Private, @RoutePath);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spUpdateRace
    @Name varchar(20),
	@InscriptionPrice numeric(6,0),
	@Date DATETIME,
	@Private bit,
	@RoutePath varchar(MAX)
AS
BEGIN
    UPDATE Race
    SET InscriptionPrice = @InscriptionPrice,
        Date = @Date,
        Private = @Private,
        RoutePath = @RoutePath
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>
Go
CREATE PROCEDURE spDeleteRace
    @Name varchar(20)
AS
BEGIN
    DELETE FROM Race
    WHERE Name = @Name;
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