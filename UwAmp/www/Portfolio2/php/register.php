<?php
   $username="root";
   $password="root";
   $dbServer="localhost:3306/mysql/";
   $dbName="portfolio2";
   $conn = new mysqli($dbServer, $username, $password, $dbName);


   // class User {
      // public $userName; 
      // public $password;
      // public $email;

      // function __construct($userName, $password, $email) {
         // $this->userName = $userName;
         // $this->password = $password;
         // $this->email = $email;
      // }
   // }
   $user = $_REQUEST["userName"];//get username from post
   $password = $_REQUEST["password"];//get pw from post
   $email = $_REQUEST["email"];//get email from post

   $isValid = false;
   if($user != null){
       //TODO: validation of posted values to make sure proper values are stored else echo "failure"
       //alphanumeric user
       if(!ctype_alnum($user)){ echo "User must contain only alpha-numeric characters."; return; }
       //encrypt pass using md5
       $encryptedPass = md5($password);

       //Can't qutie use filter_var here because of explicit alphanumeric check in instructions
       $emailArr = explode("@", $email);
       if(!ctype_alnum($emailArr[0])){ echo "Invalid email format."; return; }
       $perSplit = explode(".", $emailArr[1]);
       if(!ctype_alnum($perSplit[0]) || !ctype_alnum($perSplit[1])){ echo "Invalid address of email."; return; }

       $isValid=true;
   }

   if($isValid){
       $sql = "INSERT INTO users (UserName, Password, Email)
       VALUES ('$user', '$encryptedPass', '$email')";
       if($conn->query($sql)===TRUE){
           //echo "Created successfully";
           echo "success";
       }else{
           echo "ERROR: ".$sql."<br>".$conn->error;
       }
   }
   $conn->close();
?>