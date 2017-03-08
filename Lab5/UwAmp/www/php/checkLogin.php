<?php


$f = file("../TextFiles/users.txt");
foreach ($f as &$value) {
   sscanf($value, "%s %s", $username, $password);
   if($_REQUEST["name"]==$username && $_REQUEST["password"]==$password){
      echo json_encode("success");
      session_start();
      $_SESSION["username"] = $_REQUEST["name"];
      return;
   }
}
echo json_encode("failure");


?>