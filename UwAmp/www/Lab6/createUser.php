<?php
// THIS IS JUST A SIMPLE EXAMPLE TO SHOW CONNECTION TO A DATABASE
// YOU WILL NEED TO FILL THE PROPER CREDENTIALS FOR THE
// USERNAME, PASSWORD, AND DATABASESERVER names
// TODO: TRY USING THE CREDENTIALS SUPPLIED LATER IN THE EXERCISE

$username = "dbu319team031";
$password = "NjUxODA0OTAz";
$dbServer = "mysql.cs.iastate.edu"; 
$dbName   = "319db";

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

echo $mysqli->host_info . "<br>";


// --------------------------------------
// --- PART-2 --- INSERT DATA -----------
// --------------------------------------
$sql = "INSERT INTO Users ('UserName','Password','Email','Phone','Librarian','FirstName','LastName') ".
   "VALUES ('dmossman','fluffy67','dmossman@iastate.edu','3199394514','1','Drake','Mossman')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully<br>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


// --------------------------------------
// --- PART-3 --- GET DATA --------------
// --------------------------------------
$sql = "SELECT * FROM Users";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "UserName: " . $row["UserName"]. "  Phone: " . $row["Phone"]. "<br>";
    }
} else {
    echo "0 results";
}



// --------------------------------------
// --- PART-4 --- CLOSE -----------------
// --------------------------------------
$conn->close();

?>
