<?php



class Books {
  private $title; 
  private $author;
  public $id;

  function __construct($id,$title,$author) {
    $this->title = $title;
    $this->author = $author;
	$this->id = $id;
  }
}


class Shelf {
  private $shelfNum;
  const CAPACITY = 20;
  private $books;

  function __construct($number,$books) {
    $this->number = $title;
	$this->books = $books;
  }
  
  function hasSpace() {
	return count($books)<self::CAPACITY;
  }
  
  function addBook($book) {
	$books[$book->id] = $book;
  }
  
  function hasBook($id) {
	return $books[$id] != null;
  }
  
  function deleteBook($id) {
	unset($books[$id]);
  }
}


class Library {
  private $shelves; // array
  private $checkedOut; // array
  
  function __construct($shelves) {
    $this->shelves = $shelves;
  }
  
  /**
  * return number of shelf containing book
  */
  function findShelf($id) {
	for($i = 0;$i<count($shelves);$i++){
	  if($shelves[$i]->hasBook($id)){
	    return $i;
	  }
	}  
  }
  
  function addBook($id,$title,$author) {
	$book = new Book($id,$title,$author);
	for($i = 0;$i<count($shelves);$i++){
	  if($shelves[$i]->hasSpace()){
	    $shelves[$i]->addBook($book);
	  }
	}  
  }
  
  function deleteBook($id) {
    $shelves[findShelf($id)]->deleteBook($id);
  }
  
  function borrow
}















?>