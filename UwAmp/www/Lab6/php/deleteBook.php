<?php
//Remove specified book from database (books and booklocation)
$bookId = $_REQUEST["id"];

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

//DELETE from books
$sql = "DELETE FROM books WHERE BookId = '$bookId'";//Delete the row in books where the id's match
if ($conn->query($sql) === TRUE) {
    echo "Deleted ".$bookId." from table: books";
}else{
    echo "Failure of attempted row deletion in books";
}

//DELETE from booklocation
$sql = "DELETE FROM booklocation WHERE BookId = '$bookId'";
if($conn->query($sql)=== TRUE){
    echo "Deleted ".$bookId." from table: booklocation";
}else{
    echo "Failure of attempted row deletion in booklocation";
}
?>