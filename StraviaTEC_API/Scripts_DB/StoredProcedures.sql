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
	@PhotoPath varchar,
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
	@PhotoPath varchar,
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