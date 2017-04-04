drop table Users;
drop table Scores;

create table Users(
   UserName VARCHAR(255),
   Password VARCHAR(255),
   Email VARCHAR(255),
   Primary Key (UserName));

create table Scores(
   Score INT(10),
   UserName VARCHAR(255),
   DateScored DATE,
   GameTime INT(10),
   Primary Key (UserName, DateScored));