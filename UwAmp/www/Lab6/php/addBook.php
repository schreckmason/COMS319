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
  // echo "Connected successfully\r\n";
  // echo $conn->host_info . "\r\n\r\n";
}

// --------------------------------------
// ---        GENERATE BOOK ID        ---
// --------------------------------------

class Book {
   public $title; 
   public $author;
   public $id;
   public $shelf;

   function __construct($id, $title, $author) {
      $this->title = $title;
      $this->author = $author;
      $this->id = $id;
      $this->shelf = findNonFullShelf();
   }
}

function findNonFullShelf(){
   global $conn;
   $nonFullShelves = array();
   $sql = "SELECT count(*) AS BookCount, ShelfId FROM booklocation GROUP BY ShelfId";
   $result = $conn->query($sql);
   while($row = $result->fetch_assoc()) {
      if($row["BookCount"]<20){
         array_push($nonFullShelves, $row["ShelfId"]);
      }
   }
   if(sizeof($nonFullShelves)!=0){
      return $nonFullShelves[mt_rand(0, sizeof($nonFullShelves)-1)];
   } else {
      die("full");
   }
}

$book = new Book($_REQUEST["id"], $_REQUEST["title"], $_REQUEST["author"]);

// --------------------------------------
// ---     INSERT BOOK INTO BOOKS     ---
// --------------------------------------
// $bookid=$book->id; 
// $booktit=$book->title;
// $bookauth=$book->author;
$sql = "INSERT INTO books (BookId, BookTitle, Author, Availability) VALUES (\"".$book->id."\", \"".$book->title."\", \"".$book->author."\", 1)";

if ($conn->query($sql) === TRUE) {
    echo "success";
} else {
    die("Error: " . $sql . "<br>" . $conn->error);
}

// --------------------------------------
// ---    INSERT BOOK INTO SHELVES    ---
// --------------------------------------

$sql = "INSERT INTO booklocation (BookId, ShelfId) VALUES (\"".$book->id."\", \"".$book->shelf."\")";

if ($conn->query($sql) === TRUE) {
    echo "success";
} else {
    die("Error: " . $sql . "<br>" . $conn->error);
}
?>