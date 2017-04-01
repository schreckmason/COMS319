<?php
session_start();
//Check to make sure book is available
//Update availability and due date

$bookId = $_REQUEST["id"];//query database to get/change the rest of the information

//connect to database
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

//change availability in books to 0 where it matches the id
$sql = "UPDATE books SET Availability=0 WHERE BookId='$bookId'";
if($conn->query($sql)=== TRUE){
    echo "Borrowed ".$bookId;
}else{
    echo "Failure to borrow a book";
}
//echo "Changed availability of ".$BookId." to 0";

?>