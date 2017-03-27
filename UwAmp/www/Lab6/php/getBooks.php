<?php
//Return json containing books and shelves

/*
class Book {
   public $title; 
   public $author;
   public $availability;

   function __construct($title, $author, $availability) {
      $this->title = $title;
      $this->author = $author;
      $this->availability = $availability;
   }
}


class Shelf {
  const CAPACITY = 20;
  public $name;
  public $books;

  function __construct($name) {
   $this->name = $name;
   $this->books = array();
  }
  
  // function hasSpace() {
   // return count($books)<self::CAPACITY;
  // }
  
   function addBook($book, $id) {
      $books[$id] = $book;
   }
  
  // function hasBook($id) {
   // return $books[$id] != null;
  // }
  
  // function deleteBook($id) {
   // unset($books[$id]);
  // }
}


class Library {
public $shelves; // array

function __construct() {
   $this->shelves = array();
}

function addShelf($shelf, $id) {
   $shelves[$id] = $shelf;
}
  //return number of shelf containing book
  // function findShelf($id) {
   // for($i = 0;$i<count($shelves);$i++){
     // if($shelves[$i]->hasBook($id)){
       // return $i;
     // }
   // }  
  // }
  
  // function addBook($id,$title,$author) {
   // $book = new Book($id,$title,$author);
   // for($i = 0;$i<count($shelves);$i++){
     // if($shelves[$i]->hasSpace()){
       // $shelves[$i]->addBook($book);
     // }
   // }  
  // }
  
  // function deleteBook($id) {
    // $shelves[findShelf($id)]->deleteBook($id);
  // }
  
  // function borrow
}





*/
// --------------------------------------
// ---      CONNECT TO DATABASE       ---
// --------------------------------------

$username="root";
$password="root";
$dbServer="localhost:3306/mysql/";
$dbName="lab06_test";

// Create connection
$conn = new mysqli($dbServer, $username, $password, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
  // echo "Connected successfully<br>";
  // echo $conn->host_info . "<br><br>";
}



//--------------------------------------------------------------------------------------------------------
//          TODO: Need to change so that we put query results in classes first to make use of them.
//--------------------------------------------------------------------------------------------------------
// --------------------------------------
// ---       QUERY FOR SHELVES        ---
// --------------------------------------
/*
//Create Library
$lib = new Library();
//Fill with shelves
$sql = "SELECT * FROM shelves";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
   $lib->addShelf(new Shelf($row["ShelfName"]), $row["ShelfId"]);
}

$sql = "SELECT books.BookId, BookTitle, Author, Availability, shelves.ShelfId, ShelfName ".
       "FROM books, booklocation, shelves ".
       "WHERE books.BookId = booklocation.BookId and shelves.ShelfId = booklocation.ShelfId";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
   echo "BookTitle: " . $row["BookTitle"]. "  Author: " . $row["Author"]. "<br>";
}

*/
// --------------------------------------
// ---        QUERY FOR BOOKS         ---
// --------------------------------------

$sql = "SELECT books.BookId, BookTitle, Author, Availability, ShelfId FROM books, booklocation WHERE books.BookId = booklocation.BookId and ShelfId = ";
$shelfResults = array($conn->query($sql."0"), $conn->query($sql."1"), $conn->query($sql."2"), $conn->query($sql."3"));

echo "<table border='2'><tr><th>Art</th><th>Science</th><th>Sport</th><th>Literature</th></tr>";
for($i=0;$i<20;$i++){
   echo "<tr>";
   foreach($shelfResults as &$shelfResult){
      $shelfBook = $shelfResult->fetch_assoc();
      if($shelfBook){
         //There is another book in this shelf
         echo "<td id=".$shelfBook["BookId"].">".$shelfBook["BookTitle"]."</td>";
      } else {
         echo "<td></td>";
      }
   }
   echo "</tr>";
}
echo "</table>";
?>