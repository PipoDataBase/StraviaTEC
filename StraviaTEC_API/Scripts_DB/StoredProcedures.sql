-- ================================================
--                  ActivityType
-- ================================================
CREATE PROCEDURE spGetActivityTypes
AS
BEGIN
    SELECT * FROM ActivityType;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetActivityType
@Id tinyint
AS
BEGIN
    SELECT * FROM ActivityType where Id = @Id;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spInsertActivityType
    @Type varchar(20)
AS
BEGIN
    INSERT INTO ActivityType (Type)
    VALUES (@Type);
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

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

CREATE PROCEDURE spDeleteActivityType
    @Id tinyint
AS
BEGIN
    DELETE FROM ActivityType
    WHERE Id = @Id;
END;


-- ================================================
--                  Challenge
-- ================================================
CREATE PROCEDURE spGetChallenges
AS
BEGIN
    SELECT * FROM Challenge;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spGetChallenge
@Name varchar(20)
AS
BEGIN
    SELECT * FROM Challenge where Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

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
    SET Name = @Name,
        Goal = @Goal,
        Private = @Private,
        StartDate = @StartDate,
        EndDate = @EndDate,
        Deep = @Deep,
        Type = @Type
    WHERE Name = @Name;
END;

-- <><><><><><><><><><><><><><><><><><><><><><><><>

CREATE PROCEDURE spDeleteChallenge
    @Name varchar(20)
AS
BEGIN
    DELETE FROM Challenge
    WHERE Name = @Name;
END;