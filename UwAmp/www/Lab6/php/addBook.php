<?php
//Insert a new book into the database
//Have server generate a unique id?

$username="root";
$password="root";
$dbServer="localhost:3306/mysql/";
$dbName="lab06_test";

// --------------------------------------
// ---      CONNECT TO DATABASE       ---
// --------------------------------------

// Create connection
$conn = new mysqli($dbServer, $username, $password, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
  echo "Connected successfully<br>";
  echo $conn->host_info . "<br><br>";
}

// --------------------------------------
// ---        GENERATE BOOK ID        ---
// --------------------------------------

class Book {
   public $title; 
   public $author;
   public $id;
   public $shelf;

   function __construct($title, $author) {
      $this->title = $title;
      $this->author = $author;
      $this->id = getUniqueID();
      $this->shelf = findNonFullShelf();
   }
}

function getUniqueID(){
   //TODO: make this gauruntee uniqueness
   //do 
   //generate random id
   //while id exists in table
   return mt_rand(10000, 999999999);
}

function findNonFullShelf(){
   return mt_rand(0, 3);//TODO: Make this ensure shelf is not full
}

$book = new Book($_REQUEST["title"], $_REQUEST["author"]);

// --------------------------------------
// ---     INSERT BOOK INTO BOOKS     ---
// --------------------------------------

$sql = "INSERT INTO books (BookId, BookTitle, Author, Availability) VALUES (\"".$book->id."\", \"".$book->title."\", \"".$book->author."\", 1)";

if ($conn->query($sql) === TRUE) {
    echo "Book inserted into books successfully<br>";
} else {
    die("Error: " . $sql . "<br>" . $conn->error);
}

// --------------------------------------
// ---    INSERT BOOK INTO SHELVES    ---
// --------------------------------------

$sql = "INSERT INTO booklocation (BookId, ShelfId) VALUES (\"".$book->id."\", \"".$book->shelf."\")";

if ($conn->query($sql) === TRUE) {
    echo "Book inserted into booklocation successfully<br>";
} else {
    die("Error: " . $sql . "<br>" . $conn->error);
}
?>