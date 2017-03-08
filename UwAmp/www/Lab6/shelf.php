<?php


class Shelf {
  private $title; 
  private $author;
  private $id;

  function __construct($title,$author,$id) {
    $this->title = $title;
    $this->author = $author;
	$this->id = $id;
  }
  
}
?>