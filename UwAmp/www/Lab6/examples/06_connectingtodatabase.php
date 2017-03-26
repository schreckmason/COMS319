<?php
// THIS IS JUST A SIMPLE EXAMPLE TO SHOW CONNECTION TO A DATABASE
// YOU WILL NEED TO FILL THE PROPER CREDENTIALS FOR THE
// USERNAME, PASSWORD, AND DATABASESERVER names
// TODO: TRY USING THE CREDENTIALS SUPPLIED LATER IN THE EXERCISE

$username="root";
$password="root";
$dbServer="localhost:3306/mysql/";
$dbName="lab06_test";

// --------------------------------------
// --- PART-1 --- CONNECT TO DATABASE ---
// --------------------------------------
// USE OO MYSQL IMPROVED 

// Create connection
$conn = new mysqli($dbServer, $username, $password, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
  echo "Connected successfully<br>";
}

echo $conn->host_info . "<br><br>";


// --------------------------------------
// --- PART-2 --- INSERT DATA -----------
// --------------------------------------
// $sql = "INSERT INTO books (BookId, BookTitle, Author, Availablity) VALUES (314159265, 'The Lord of the Rings', 'C.S. Lewis', 1)";
$sql = "INSERT INTO books (BookId, BookTitle, Author, Availablity) VALUES (27182818, 'Don Quixote', 'Miguel de Cervantes', 1)";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully<br>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


// --------------------------------------
// --- PART-3 --- GET DATA --------------
// --------------------------------------
$sql = "SELECT * FROM books";

$result = $conn->query($sql);

// var_dump($result);
echo "<br><br>";
if($result){
   if($result->num_rows > 0) {
       // output data of each row
       while($row = $result->fetch_assoc()) {
           echo "BookTitle: " . $row["BookTitle"]. "  Author: " . $row["Author"]. "<br>";
       }
   } else {
       echo "0 results";
   }
} else {
   echo "query error";
}



// --------------------------------------
// --- PART-4 --- CLOSE -----------------
// --------------------------------------
$conn->close();

?>
