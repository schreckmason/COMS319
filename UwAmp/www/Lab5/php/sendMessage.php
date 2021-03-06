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
    return base64_encode($cipher->encrypt($string));
}
	// $rsa = new Crypt_RSA();
	// $rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
	// $rsa->setPublicKeyFormat(CRYPT_RSA_PUBLIC_FORMAT_PKCS1);
	// extract($rsa->createKey(1024)); /// makes $publickey and $privatekey available
    
// //Private key
// $private_key = $privatekey;
// $public_key = $publickey;

function addMessage($fileName, $sender, $recipient, $encryptedMessage) {
    $file = file_get_contents($fileName, true);
    $data = json_decode($file, true);
    unset($file);
    //you need to add new data as next index of data.
    $data[] = array('sender' => $sender, 'recipient' => $recipient, 'encryptedMessage' => $encryptedMessage);
    $result=json_encode($data);
    file_put_contents($fileName, $result);
    unset($result);
}

//get public key of recipient
$users = json_decode(file_get_contents("../TextFiles/users.txt"));
for($i=0;$i<count($users);$i++){
   if($users[$i]->username == $recipient){//find the recipient
      $recipientPubKey = $users[$i]->pubKey;
      echo "encrypting with ".$users[$i]->username."'s public key".$recipientPubKey;
      break;
   }
}

// $encryptedUser = rsa_encrypt($recipient, $recipientPubKey);
$encryptedMessage = rsa_encrypt($message, $recipientPubKey);
$file = "../TextFiles/messages.txt";
//append to messages
addMessage($file, $_SESSION["username"], $recipient, $encryptedMessage);

//For decryption:
// $responseFile=file_get_contents("messages.txt");
// $responseArray=json_decode($responseFile,true);
// $encodedMsg=$responseArray["encryptedMessage"];
// $jsonDecodedmsg=base64_decode($encodedMsg);
// $decipheredText = rsa_decrypt($jsonDecodedmsg, $private_key);
// echo $decipheredText

// file_put_contents($file, $encryptedUser." ".$encryptedMessage."\n", FILE_APPEND | LOCK_EX);//write to messages.txt


?>