<?php
//NOTE: do not delete this, simply comment it out and replace with your credentials for testing. I will do likewise
$username="root";
$password="root";
$dbServer="localhost:3306/mysql/";
$dbName="lab06_test";
$conn = new mysqli($dbServer, $username, $password, $dbName);


class User {
   public $userName; 
   public $password;
   public $email;
   public $phone;
   public $isLib;
   public $fName;
   public $lName;

   function __construct($isLib, $userName, $password, $email, $phone, $fName, $lName) {
      $this->title = $title;
      $this->userName = $userName;
      $this->password = $password;
      $this->email = $email;
      $this->phone = $phone;
      $this->isLib = $isLib;
      $this->fName = $fName;
      $this->lName = $lName;
   }
}
class Librarian {
   function __construct($userName, $password, $email, $phone, $fName, $lName) {
      parent::__construct(true, $userName, $password, $email, $phone, $fName, $lName);
   }
}
class Student {
   function __construct($userName, $password, $email, $phone, $fName, $lName) {
      parent::__construct(false, $userName, $password, $email, $phone, $fName, $lName);
   }
}
$user = $_REQUEST["userName"];//get username from post
$password = $_REQUEST["password"];//get pw from post
$passChk = $_REQUEST["passConfirm"];//get the pw confirm from post
$email = $_REQUEST["email"];//get email from post
$phone = $_REQUEST["phone"];//get phone from post
$isLib = $_REQUEST["isLib"];//get whether or not the user is registering a librarian
$firstName = $_REQUEST["fName"];//get first name from post
$lastName = $_REQUEST["lName"];//get last name from post

$isValid = false;
$newUser = $_REQUEST["isLib"]==1?new Librarian($_REQUEST["userName"], $_REQUEST["password"], $_REQUEST["email"], $_REQUEST["phone"], $_REQUEST["fName"], $_REQUEST["lName"]):
   new Student($_REQUEST["userName"], $_REQUEST["password"], $_REQUEST["email"], $_REQUEST["phone"], $_REQUEST["fName"], $_REQUEST["lName"]);
if($newUser->userName!=null){
    //TODO: validation of posted values to make sure proper values are stored else echo "failure"
    //alphanumeric user
    if(!ctype_alnum($user)){ echo "User must contain only alpha-numeric characters."; return; }
    //encrypt pass using md5
    if(!($password===$passChk)){echo "Password mismatch"; return; }
    else{ $encryptedPass = md5($password); }

    //Can't qutie use filter_var here because of explicit alphanumeric check in instructions
    $emailArr = explode("@", $email);
    if(!ctype_alnum($emailArr[0])){ echo "Invalid email format."; return; }
    $perSplit = explode(".", $emailArr[1]);
    if(!ctype_alnum($perSplit[0]) || !ctype_alnum($perSplit[1])){ echo "Invalid address of email."; return; }


    if(strpos($phone, '-')!==false){
        $phoneArr=explode("-",$phone);//xxx-xxx-xxxx
        if(!ctype_digit($phoneArr[0]) || !ctype_digit($phoneArr[1]) || !ctype_digit($phoneArr[2])){ echo "Invalid phone number"; return; }
        $phone = str_replace("-","",$phone);
    }
    else{
        //xxxxxxxxxx
        if(!ctype_digit($phone)){
            echo "Invalid phone number";
            return;
        }
    }

    if(!ctype_alpha($firstName)){ echo "First name may only contain letters."; return;}
    if(!ctype_alpha($lastName)){ echo "Last name may only contain letters."; return; }
    $isValid=true;
}

if($isValid){
    $sql = "INSERT INTO users (UserName, Password, Email, Phone, Librarian, FirstName, LastName)
    VALUES ('$user', '$encryptedPass', '$email', '$phone', '$isLib', '$firstName', '$lastName')";
    if($conn->query($sql)===TRUE){
        //echo "Created successfully";
        echo "success";
    }else{
        echo "ERROR: ".$sql."<br>".$conn->error;
    }
    $conn->close();
}


?>