<?php
session_start();

$posts = json_decode(file_get_contents("../TextFiles/posts.txt"));
if($_REQUEST["action"] != "create"){
   for($i = 0;$i<count($posts);$i++) {
      if($posts[$i]->title == $_REQUEST["title"] &&
         $posts[$i]->author == $_REQUEST["author"] &&
         $posts[$i]->time == $_REQUEST["time"]){
            if($_REQUEST["action"] == "delete"){
               array_splice($posts, $i, 1);
            } elseif($_REQUEST["action"] == "update") {
               $posts[$i]->message = $_REQUEST["message"];
            } else {
               // invalid action
            }
            file_put_contents("../TextFiles/posts.txt",json_encode($posts));
            echo "successful ".$_REQUEST["action"];
            return;
      }
   }
} else {
   //create new post
   $newPost = (object) array('title' => $_REQUEST["title"],
                     'message' => $_REQUEST["message"],
                     'author' => $_REQUEST["author"],
                     'time' => $_REQUEST["time"]);
   $newPost -> author = $_SESSION["username"];
   array_unshift($posts, $newPost);//insert new post to beginning of post array
   file_put_contents("../TextFiles/posts.txt",json_encode($posts));
   echo "successful post creation";
}

?>