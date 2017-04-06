<?php
session_start();
// --------------------------------------
// ---      CONNECT TO DATABASE       ---
// --------------------------------------

$username="root";
$password="root";
$dbServer="localhost:3306/mysql/";
$dbName="portfolio2";

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
// ---  GET PREVIOUS PERSONAL RECORD  ---
// --------------------------------------
$score = intval($_REQUEST["score"]);
$username = $_SESSION["username"];
$sql = "SELECT * FROM PersonalRecords WHERE UserName = '".$username."'";
$result = $conn->query($sql);
$pastPersonalRecord = false; 
while($row = $result->fetch_assoc()) {
   $pastPersonalRecord = $row["Score"];
}

if($pastPersonalRecord == False || $pastPersonalRecord < $score){
   // --------------------------------------
   // ---     UPDATE PERSONAL RECORD     ---
   // --------------------------------------
   if($pastPersonalRecord != False){
      $sql = "DELETE FROM PersonalRecords WHERE UserName = '".$username."'";
      if ($conn->query($sql) === FALSE) {
         die("Error updating Personal Record table:\n".$conn->error);
      }
   }
   
   $sql = "INSERT INTO PersonalRecords (Score, UserName) VALUES ('".$score."', '".$username."')";
   if ($conn->query($sql) === FALSE) {
      die("Error updating Personal Record table:\n".$conn->error);
   }
   
   // --------------------------------------
   // ---         RETURN MESSAGE         ---
   // --------------------------------------
   if($pastPersonalRecord == False){
      echo "Congratulations!\n".
         "You scored ".$score.".\n".
         "Try again to beat your record.";
   } else {
      echo "Congratulations!\n".
         "You set a new personal record of ".$score.",\n".
         "beating your previous best of ".$pastPersonalRecord.".";
   }
} else {
   echo "Well Done!\n".
      "You scored ".$score.".\n".
      "Your personal best is ".$pastPersonalRecord.".";
}
?>
