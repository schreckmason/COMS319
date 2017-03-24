<?php
//echo "failure";
$username = $_REQUEST["name"];
$password = $_REQUEST["password"];

session_start();
//Set the username for the session
$_SESSION["username"] = $username;

if($username==="admin" || $username==="Admin"){
   $username = "admin";
    echo "success";
} else {
   //Get an array of user json representations
   $users = json_decode(file_get_contents("../TextFiles/users.txt"));
   
   for($i=0;$i<count($users);$i++){
       if($users[$i]->username == $username && $users[$i]->password == $password){
           echo "success";
           //Set the private key for the session to be used in messaging
           $_SESSION["privKey"] = $users[$i]->privKey;
           //Set the public key for the session to be used in messaging
           $_SESSION["pubKey"] = $users[$i]->pubKey;
           return;
       }
   }
}
?>