<?php
session_start();
//Connect to DB
$DB_USER="root";
$DB_PASS="root";
$DB_SERVER="localhost:3306/mysql/";
$DB_NAME="portfolio2";
$conn = new mysqli($DB_SERVER, $DB_USER, $DB_PASS, $DB_NAME);

//Obtain posted information
$user = $_REQUEST["username"];//obtain posted username
$password = $_REQUEST["password"];//obtain posted password (NEED TO MD5() DECRYPT ME)

$encryptedPass = md5($password);

//Check for existing user, if found check the entered password (encrypted) to the saved encrypted password
$searchUser = $_POST["username"];
$sql = "SELECT * FROM users WHERE UserName = '$user'";

$result=$conn->query($sql);

$row=mysqli_fetch_array($result, MYSQLI_ASSOC);
if(count($row)!=0){
    if($encryptedPass === $row["Password"]){
        //printf("%s (%s)\n", $row["UserName"], $row["Password"]);
        $_SESSION["username"] = $user;//store username for the session
        echo "Success";
    } else {
        //echo "The password or username entered do not match.";
        echo "Failure1";
    }
} else {
   echo "Failure2";
}

$conn->close();

?>