drop table users;
drop table books;
drop table loanHistory;
drop table shelves;
drop table bookLocation;

create table users(
	UserName VARCHAR(255),
	Password VARCHAR(255),
	Email VARCHAR(255),
	Phone VARCHAR(255),
	Librarian TINYINT,
	FirstName VARCHAR(255),
	LastName VARCHAR(255),
    Primary Key (UserName));

create table books(
	BookId INT(10),
	BookTitle VARCHAR(255),
	Author VARCHAR(255),
	Availability TINYINT,
    Primary Key (BookId));

create table loanHistory(
	UserName VARCHAR(255),
	BookId INT(10),
	DueDate DATE,
	ReturnedDate DATE,
    Primary Key (UserName, BookId));

create table shelves(
	ShelfId INT(10),
	ShelfName VARCHAR(255),
    Primary Key (ShelfId));
    
create table bookLocation(
	BookId INT(10),
	ShelfId INT(10),
    Primary Key (BookId));
    
INSERT INTO shelves (shelfId, ShelfName) VALUES (0, 'Art');
INSERT INTO shelves (shelfId, ShelfName) VALUES (1, 'Science');
INSERT INTO shelves (shelfId, ShelfName) VALUES (2, 'Sport');
INSERT INTO shelves (shelfId, ShelfName) VALUES (3, 'Literature');