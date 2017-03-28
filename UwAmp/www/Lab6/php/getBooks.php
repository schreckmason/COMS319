<?php
//Return table containing books in shelves

// --------------------------------------
// ---       CLASS DESCRIPTIONS       ---
// --------------------------------------

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
   
   function addBook($book, $id) {
      $this->books[$id] = $book;
   }
}


class Library {
   public $shelves; // array

   function __construct() {
      $this->shelves = array();
   }

   function addShelf($shelf, $id) {
      $this->shelves[$id] = $shelf;
   }

   function addBook($book, $ShelfId, $BookId) {
      $this->shelves[$ShelfId]->addBook($book, $BookId);
   }
}

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
}

// --------------------------------------
// ---       QUERY INTO OBJECTS       ---
// --------------------------------------

//Create Library
$lib = new Library();
//Fill with shelves (Should only be 4)
$sql = "SELECT * FROM shelves";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
   $lib->addShelf(new Shelf($row["ShelfName"]), $row["ShelfId"]);
}
//Fill with Books
$sql = "SELECT books.BookId, BookTitle, Author, Availability, ShelfId ".
       "FROM books, booklocation ".
       "WHERE books.BookId = booklocation.BookId";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()) {
   $lib->addBook(new Book($row["BookTitle"], $row["Author"], $row["Availability"]), $row["ShelfId"], $row["BookId"]);
}

// --------------------------------------
// ---       OUTPUT HTML TABLE        ---
// --------------------------------------

foreach($lib->shelves as &$shelf){
   reset($shelf->books); //reset the iterator to the beginning of the list
}
echo "<table border='2'><tr><th>Art</th><th>Science</th><th>Sport</th><th>Literature</th></tr>";//TODO:change to print from obj?
for($i=0;$i<20;$i++){
   echo "<tr>";
   foreach($lib->shelves as &$shelf){
      if(list($bookId, $book) = each($shelf->books)){
         //There is another book in this shelf
         // echo "BookId: ".$bookId."\n";
         // echo "Book: ".$book."\n";
         echo "<td id=".$bookId.
              " author='".$book->author."'".
              " availability=".$book->availability.
              " bgcolor='".($book->availability==1?"#FFFFFF":"#FF9999")."'".
              " >".$book->title."</td>";
      } else {
         echo "<td></td>";
      }
   }
   echo "</tr>";
}
echo "</table>";
?>
<script>

</script>