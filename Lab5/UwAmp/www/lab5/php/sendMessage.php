<?php
session_start();
//Get access to the encryption folder
$path = 'phpseclib';
set_include_path(get_include_path() . PATH_SEPARATOR . $path);
include_once('Crypt/RSA.php');

$recipient = $_REQUEST["recipient"];//get posted recipient
$message = $_REQUEST["message"];//get posted message content

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
    return $cipher->encrypt($string);
}
	$rsa = new Crypt_RSA();
	$rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
	$rsa->setPublicKeyFormat(CRYPT_RSA_PUBLIC_FORMAT_PKCS1);
	extract($rsa->createKey(1024)); /// makes $publickey and $privatekey available
    
//Private key
$private_key = $privatekey;
$public_key = $publickey;


//get public key
$pubKey = $_SESSION["pubKey"];
$encryptedUser = rsa_encrypt($recipient, $pubKey);
$encryptedMessage = rsa_encrypt($message, $pubKey);
//write to a file
$file = "../TextFiles/messages.txt";
file_put_contents($file, $encryptedUser." ".$encryptedMessage."\n", FILE_APPEND | LOCK_EX);//write to messages.txt
?>