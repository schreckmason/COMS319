<?php
$file=fopen("../TextFiles/users.txt","w");
if($_POST["name"]){
    $name = $_POST["name"];
    $password = $_POST["password"];
    fwrite($file, $name);
    fwrite($file, " ");
    fwrite($file, $password);
    fclose($file);
    echo "success";
}
?>