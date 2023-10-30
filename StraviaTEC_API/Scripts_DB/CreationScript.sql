CREATE TABLE Sportman (
	Username varchar(20) NOT NULL,
	Name varchar(20),
	LastName1 varchar(20),
	LastName2 varchar(20),
	BirthDate DATE NOT NULL,
	PhotoPath varchar,
	Password varchar(20) NOT NULL,
	Nationality varchar(20) NOT NULL,
	PRIMARY KEY (Username)
);

CREATE TABLE Friend (
	Username varchar(20) NOT NULL,
	FriendUsername varchar(20) NOT NULL,
	PRIMARY KEY (Username,FriendUsername)
);

CREATE TABLE GroupManager (
	Username varchar(20) NOT NULL,
	GroupName varchar(20) NOT NULL,
	PRIMARY KEY (Username,GroupName)
);

CREATE TABLE Group_ (
	Name varchar(20) NOT NULL,
	PRIMARY KEY (Name)
);

CREATE TABLE SportmanGroup (
	Username varchar(20) NOT NULL,
	GroupName varchar(20) NOT NULL,
	PRIMARY KEY (Username,GroupName)
);

CREATE TABLE Activity (
	Id int NOT NULL,
	Kilometers numeric(10,3) NOT NULL,
	Duration TIME NOT NULL,
	Date DATETIME NOT NULL,
	RoutePath varchar NOT NULL,
	Username varchar(20),
	RaceName varchar(20),
	ChallengeName varchar(20),
	Type tinyint,
	PRIMARY KEY (Id)
);

CREATE TABLE ActivityType (
	Id tinyint IDENTITY(1,1),
	Type varchar(20) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE ChallengeGroup (
	ChallengeName varchar(20) NOT NULL,
	GroupName varchar(20) NOT NULL,
	PRIMARY KEY (ChallengeName,GroupName)
);

CREATE TABLE Challenge (
	Name varchar(20) NOT NULL,
	Goal numeric(12,3) NOT NULL,
	Private bit NOT NULL,
	StartDate DATETIME NOT NULL,
	EndDate DATETIME NOT NULL,
	Deep bit NOT NULL,
	Type tinyint,
	PRIMARY KEY (Name)
);

CREATE TABLE Sponsor (
	TradeName varchar(20) NOT NULL,
	LegalRepresentant varchar(20),
	Phone numeric(8,0),
	LogoPath varchar,
	PRIMARY KEY (TradeName)
);

CREATE TABLE ChallengeSponsor (
	SponsorTradeName varchar(20) NOT NULL,
	ChallengeName varchar(20) NOT NULL,
	PRIMARY KEY (SponsorTradeName,ChallengeName)
);


CREATE TABLE Race (
	Name varchar(20) NOT NULL,
	InscriptionPrice numeric(6,0) NOT NULL,
	Date DATETIME NOT NULL,
	Private bit NOT NULL,
	RoutePath varchar,
	PRIMARY KEY (Name)
);

CREATE TABLE RaceSportman (
	Username varchar(20) NOT NULL,
	RaceName varchar(20) NOT NULL,
	PRIMARY KEY (Username,RaceName)
);

CREATE TABLE Bill (
	Id INT IDENTITY(1,1),
	PhotoPath varchar,
	Accepted bit NOT NULL,
	Username varchar(20) NOT NULL,
	RaceName varchar(20) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE RaceCategory (
	RaceName varchar(20) NOT NULL,
	CategoryId tinyint NOT NULL,
	PRIMARY KEY (RaceName,CategoryId)
);

CREATE TABLE Category (
	Id tinyint IDENTITY(1,1),
	MinimumAge tinyint NOT NULL,
	MaximumAge tinyint NOT NULL,
	Category varchar(20) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE BankAccount (
	RaceName varchar(20) NOT NULL,
	BankAccount varchar(20) NOT NULL,
	PRIMARY KEY (RaceName)
);

CREATE TABLE RaceSponsor (
	SponsorTradeName varchar(20) NOT NULL,
	RaceName varchar(20) NOT NULL,
	PRIMARY KEY (SponsorTradeName,RaceName)
);

ALTER TABLE Friend ADD CONSTRAINT Friend_fk0 FOREIGN KEY (Username) REFERENCES Sportman(Username);
ALTER TABLE Friend ADD CONSTRAINT Friend_fk1 FOREIGN KEY (FriendUsername) REFERENCES Sportman(Username);

ALTER TABLE GroupManager ADD CONSTRAINT GroupManager_fk0 FOREIGN KEY (Username) REFERENCES Sportman(Username);
ALTER TABLE GroupManager ADD CONSTRAINT GroupManager_fk1 FOREIGN KEY (GroupName) REFERENCES Group_(Name);

ALTER TABLE SportmanGroup ADD CONSTRAINT SportmanGroup_fk0 FOREIGN KEY (Username) REFERENCES Sportman(Username);
ALTER TABLE SportmanGroup ADD CONSTRAINT SportmanGroup_fk1 FOREIGN KEY (GroupName) REFERENCES Group_(Name);

ALTER TABLE Activity ADD CONSTRAINT Activity_fk0 FOREIGN KEY (Username) REFERENCES Sportman(Username);
ALTER TABLE Activity ADD CONSTRAINT Activity_fk1 FOREIGN KEY (ChallengeName) REFERENCES Challenge(Name);
ALTER TABLE Activity ADD CONSTRAINT Activity_fk2 FOREIGN KEY (Type) REFERENCES ActivityType(Id);
ALTER TABLE Activity ADD CONSTRAINT Activity_fk3 FOREIGN KEY (RaceName) REFERENCES Race(Name);

ALTER TABLE ChallengeGroup ADD CONSTRAINT ChallengeGroup_fk0 FOREIGN KEY (ChallengeName) REFERENCES Challenge(Name);
ALTER TABLE ChallengeGroup ADD CONSTRAINT ChallengeGroup_fk1 FOREIGN KEY (GroupName) REFERENCES Group_(Name);

ALTER TABLE Challenge ADD CONSTRAINT Challenge_fk0 FOREIGN KEY (Type) REFERENCES ActivityType(Id);

ALTER TABLE ChallengeSponsor ADD CONSTRAINT ChallengeSponsor_fk0 FOREIGN KEY (SponsorTradeName) REFERENCES Sponsor(TradeName);
ALTER TABLE ChallengeSponsor ADD CONSTRAINT ChallengeSponsor_fk1 FOREIGN KEY (ChallengeName) REFERENCES Challenge(Name);

ALTER TABLE RaceSportman ADD CONSTRAINT RaceSportman_fk0 FOREIGN KEY (Username) REFERENCES Sportman(Username);
ALTER TABLE RaceSportman ADD CONSTRAINT RaceSportman_fk1 FOREIGN KEY (RaceName) REFERENCES Race(Name);

ALTER TABLE Bill ADD CONSTRAINT Bill_fk0 FOREIGN KEY (RaceName) REFERENCES Race(Name);

ALTER TABLE RaceCategory ADD CONSTRAINT RaceCategory_fk0 FOREIGN KEY (RaceName) REFERENCES Race(Name);
ALTER TABLE RaceCategory ADD CONSTRAINT RaceCategory_fk1 FOREIGN KEY (CategoryId) REFERENCES Category(Id);

ALTER TABLE BankAccount ADD CONSTRAINT BankAccount_fk0 FOREIGN KEY (RaceName) REFERENCES Race(Name);

ALTER TABLE RaceSponsor ADD CONSTRAINT RaceSponsor_fk0 FOREIGN KEY (SponsorTradeName) REFERENCES Sponsor(TradeName);
ALTER TABLE RaceSponsor ADD CONSTRAINT RaceSponsor_fk1 FOREIGN KEY (RaceName) REFERENCES Race(Name);