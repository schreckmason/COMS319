create table Users(
   UserName VARCHAR(255),
   Password VARCHAR(255),
   Email VARCHAR(255),
   Primary Key (UserName));

create table PersonalRecords(
   Score INT(10),
   UserName VARCHAR(255),
   Primary Key (UserName));