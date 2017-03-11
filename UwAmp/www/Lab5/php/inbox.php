<?php
session_start();
$path = 'phpseclib';
set_include_path(get_include_path() . PATH_SEPARATOR . $path);
include_once('Crypt/RSA.php');

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

	// $rsa = new Crypt_RSA();
	// $rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
	// $rsa->setPublicKeyFormat(CRYPT_RSA_PUBLIC_FORMAT_PKCS1);
	// extract($rsa->createKey(1024)); /// makes $publickey and $privatekey available


//get public key from session
$pubKey = $_SESSION["pubKey"];
//get private key from session
$privKey = $_SESSION["privKey"];
//read through messages.txt
// $lineHandle = fopen("../TextFiles/messages.txt", "r");
// if($lineHandle){
    // while(($line = fgets($lineHandle))!==false){
        // //process the line read
        // $lineArr = explode(" ", $line);
        // $recipient = rsa_decrypt($lineArr[0], $privKey);//check the decrypted name of every line
        // if(strcmp($recipient, $_SESSION["username"]) == 0){
            // $message = rsa_decrypt($lineArr[1], $privKey);//if the session username matches that of a message, decrypt the message
            // echo "To: ".$_SESSION["username"]."\n"."Message: ".$message;
            // return;
        // }
        // else{
            // continue;
        // }
    // }
    // fclose($handle);
// }
//if the decrypted user matches current user alert message


$messageFile = "../TextFiles/messages.txt";
$messages = json_decode(file_get_contents($messageFile));
for($i = 0;$i<count($messages);$i++) {
   if($messages[$i]->recipient == $_SESSION["username"]){
      //If this message is for me
      $msg = rsa_decrypt($messages[$i]->encryptedMessage, $pubKey);//decrypt it with my public key
      echo "<tr><td><div>From: ".$messages[$i]->sender."</div><div>".$msg."</div><br><br></td></tr>";
   }
}
?>