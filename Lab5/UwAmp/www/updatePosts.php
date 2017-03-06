<?php
session_start();
//echo "----------START OF UPDATPOSTS.PHP---------";
//$_SESSION["username"];
//var_dump($_REQUEST)

$posts = json_decode(file_get_contents("posts.txt"));
 for($i = 0;$i<count($posts);$i++) {
   if($posts[$i]->title == $_REQUEST["title"]){
      $posts[$i]->message = $_REQUEST["message"];
      file_put_contents("posts.txt",json_encode($posts));
      //echo file_get_contents("posts.txt");
      return;
   }
}

$newPost = (object) array('title' => $_REQUEST["title"],
                  'message' => $_REQUEST["message"],
                  'author' => $_REQUEST["author"],
                  'time' => $_REQUEST["time"]);
$newPost -> author = $_SESSION["username"];
$posts[] = $newPost;
file_put_contents("posts.txt",json_encode($posts));
//echo "-----------END OF UPDATPOSTS.PHP----------";
?>