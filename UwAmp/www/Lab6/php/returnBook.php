<?php
//Update ReturnedDate in loanHistory and availability in book
//get username from session
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
$sql = "UPDATE books SET Availability=1 WHERE BookId='$bookId'";
if($conn->query($sql)=== TRUE){
    echo "Returned ".$bookId;
}else{
    echo "Failure to return a book";
}
$returned = date("Y-m-d");
$sql = "UPDATE loanhistory SET ReturnedDate='$returned' WHERE BookId='$bookId'";
if($conn->query($sql)===TRUE){
    echo "Updated loanhistory, book returned.";
}else{
    echo "Failed to update loanhistory, book not returned";
}
//echo "Changed availability of ".$BookId." to 0";
?>