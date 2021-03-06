<?php
session_start();
//Get access to the encryption folder
$path = 'phpseclib';
set_include_path(get_include_path() . PATH_SEPARATOR . $path);
include_once('Crypt/RSA.php');

//COPIED FROM ExampleCryptography.php

//Function for encrypting with RSA
function rsa_encrypt($string, $public_key)
{
    //Create an instance of the RSA cypher and load the key into it
    $cipher = new Crypt_RSA();
    $cipher->loadKey($public_key);
    //Set the encryption mode
    $cipher->setEncryptionMode(CRYPT_RSA_ENCRYPTION_PKCS1);
    //Return the encrypted version
    return base64_encode($cipher->encrypt($string));
}

//Function for decrypting with RSA 
function rsa_decrypt($string, $private_key)
{
    //Create an instance of the RSA cypher and load the key into it
    $cipher = new Crypt_RSA();
    $cipher->loadKey($private_key);
    //Set the encryption mode
    $cipher->setEncryptionMode(CRYPT_RSA_ENCRYPTION_PKCS1);
    //Return the decrypted version
    return $cipher->decrypt(base64_decode($string));
}

//Create new private/public key pair
	$rsa = new Crypt_RSA();
	$rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
	$rsa->setPublicKeyFormat(CRYPT_RSA_PUBLIC_FORMAT_PKCS1);
	extract($rsa->createKey(1024)); /// makes $publickey and $privatekey available
    
$private_key = $privatekey;
$public_key = $publickey;

$users = json_decode(file_get_contents("../TextFiles/users.txt"));
for($i = 0;$i<count($users);$i++) {
   if($users[$i]->username == $_REQUEST["name"]){
      //edit single user
      $users[$i]->password = $_REQUEST["password"];
      $users[$i]->pubKey = $public_key;
      $users[$i]->privKey = $private_key;
      //overwrite file
      file_put_contents("../TextFiles/users.txt",json_encode($users));
      return;
   }
}

//This is the first user to sign up.
$newUser = (object) array('username' => $_REQUEST["name"],
                  'password' => $_REQUEST["password"],
                  'pubKey'=>$public_key,
                  'privKey'=>$private_key);
$users[] = $newUser;
file_put_contents("../TextFiles/users.txt",json_encode($users));
echo "success";
?>