<?php
$user = $_REQUEST["user"];
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
$sql = "SELECT * FROM loanhistory WHERE UserName = '$user'";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()){
    echo "<tr><td>".$row["UserName"]."</td><td>".$row["BookId"]."</td><td>".$row["DueDate"]."</td><td>".($row["ReturnedDate"]==NULL ? "Not Returned": $row["ReturnedDate"])."</td></tr>";
}

?>