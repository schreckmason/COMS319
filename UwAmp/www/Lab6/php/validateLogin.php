<?php
session_start();//start the session to being storing credentials and actions
//Connect to DB
$DB_USER="root";
$DB_PASS="root";
$DB_SERVER="localhost:3306/mysql/";
$DB_NAME="lab06_test";
$conn = new mysqli($DB_SERVER, $DB_USER, $DB_PASS, $DB_NAME);

//Obtain posted information
$user = $_REQUEST["username"];//obtain posted username
$password = $_REQUEST["password"];//obtain posted password (NEED TO MD5() DECRYPT ME)

$encryptedPass = md5($password);

//Check for existing user, if found check the entered password (encrypted) to the saved encrypted password
$searchUser = $_POST["username"];
$sql = "SELECT * FROM users WHERE UserName = '$searchUser'";
$result=$conn->query($sql);

$row=mysqli_fetch_array($result, MYSQLI_ASSOC);
if(count($row)!=0){
    if($encryptedPass === $row["Password"]){
        //printf("%s (%s)\n", $row["UserName"], $row["Password"]);
        $_SESSIONS["username"] = $user;//store username for the session
        $_SESSIONS["isLibrarian"] = $row["Librarian"];//store whether or not the user is a librarian
        echo "Success";
        //REDIRECT TO library.php
        return;
    }
    else{
        //echo "The password or username entered do not match.";
        echo "Failure";
    }
}


//$conn->close();

?>