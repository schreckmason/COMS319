<?php
session_start();

//sends an array of json objects each representing a user

$users = file_get_contents("../TextFiles/users/passwords/public key/private key/users.txt");
$data = json_decode($users);
$arr = array();
$size = count($data);
for($i=0;$i<$size; $i++) {
   echo "<tr id=\"entry".$i."\"><td><div>".$data[$i]->name."</div><div>".$data[$i]->password."</div><div>".
   $data[$i]->pubKey."</div><div>".$data[$i]->privKey."</div><div><br><br></td></tr>";
}

?>