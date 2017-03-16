drop table users;
drop table books;
drop table loanHistory;
drop table shelves;
drop table BookLocation;

create table users(
	UserName VARCHAR(255),
	Password VARCHAR(255),
	Email VARCHAR(255),
	Phone INT(10),
	Librarian TINYINT,
	FirstName VARCHAR(255),
	LastName VARCHAR(255),
    Primary Key (UserName));

create table books(
	BookId INT(10),
	BookTitle VARCHAR(255),
	Author VARCHAR(255),
	Availablity TINYINT,
    Primary Key (BookId));

create table loanHistory(
	userName VARCHAR(255),
	BookId INT(10),
	DueDate DATE,
	ReturnedDate DATE,
    Primary Key (UserName));

create table shelves(
	shelfId INT(10),
	ShelfName VARCHAR(255),
    Primary Key (ShelfId));
    
create table BookLocation(
	BookId INT(10),
	ShelfId INT(10),
    Primary Key (BookId));