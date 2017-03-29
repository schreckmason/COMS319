/* --------------------------------------------- Handler functions --------------------------------------------------------*/


var numCheckedOutBooks = function(){
   var count = 0;
   var user = getUser();
   l.shelves.forEach(function(shelf){
         shelf.books.forEach(function(book){
            if(book.borrowedBy == user)
               count++;
         });
      });
   return count;
}

var getUser = function(){
   return localStorage.getItem('user');
}

var updateLocalStorage = function(){
   var libData = JSON.stringify(l)
   localStorage.setItem("lib", libData);
}

/* --------------------------------------------- CLASS DEFINITIONS --------------------------------------------------------*/

class Library{
   
   constructor(){
      this.shelfNames = ["Art", "Science", "Sport", "Literature"];
      if(arguments.length>0){
         this.populateFromJson(arguments[0]);
      } else {
         this.shelves = [new Shelf(), new Shelf(), new Shelf(), new Shelf()];
         for(var i=0; i<25; i++){
            let b = new Book("B"+i);
            this.addBook(b);
         }
      }
   }
   populateFromJson(jsonLib){
      var libData = JSON.parse(jsonLib);
      this.shelves = libData.shelves;
      console.log(libData);
   }

   addBook(book){
      console.log(book);
      console.log(this.shelves);
      this.shelves[book.id%4].books.push(book);
   }
   
   findBook(bookID){
      var foundBook = false;
      this.shelves.forEach(function(shelf){
         shelf.books.forEach(function(book){
            if(book.id == bookID){
               foundBook = book;
            }
         });
      });
      return foundBook;
   }
   
   getShelfNum(shelfName){
      shelfName = shelfName.charAt(0).toUpperCase() + shelfName.slice(1).toLowerCase();
      return this.shelfNames.findIndex(function(name){return name==shelfName;});
   }
}

class Shelf{
   constructor(){
      if(arguments.length > 0){
         this.books = arguments[0];
      } else {
         this.books = [];
      }
   }
}

class Book{
   constructor(title){
      console.log(arguments);
      this.title = title;
      this.availability = 1;
      this.borrowedBy = undefined;
      this.id = Math.floor(Math.random() * 1000);
      if(arguments.length == 2){
         var shelfNum = arguments[1];
         this.id = this.id - this.id%4 + shelfNum;
      }
   }
}

/* --------------------------------------------- Create Library --------------------------------------------------------*/


var initLibrary = function(){
   //localStorage.removeItem('lib');//uncomment to reset library
   var libData = localStorage.getItem('lib');
   if(libData){
      l = new Library(libData);
   } else {
      l = new Library();
   }
}

/* --------------------------------------------- Document Ready --------------------------------------------------------*/

$(document).ready( function () {
   //No matter the credentials the table needs to be generated first
   // let l;
   // initLibrary();
   
   tablePlaceHolder = $("<div id='tableDiv'/>");
   descDiv = $("<div id='bookDescription' />");
   $('body').append(tablePlaceHolder);
   $('body').append($('<br/>'));
   $('body').append(descDiv);
   $('body').append($('<br/>'));
   
   $.post("getBooks.php", {},
      function(data,status){
         $("#tableDiv").html(data);
      });
   // updateTable();
   
   // if(getUser()==='admin'){
      // //generate librarian view
      // generateLibrarianFields();
   // }
});

/* --------------------------------------------- GUI Functions --------------------------------------------------------*/

var updateTable = function(){
   var maxBooks = 0;
   l.shelves.forEach(function(item){maxBooks = Math.max(item.books.length, maxBooks);});
   var shelves = 4;
   
   //Table generation taken from test1.js but implemented with our class structure
   bookTable = $("<table id='table' border='2'></table>"); // creates DOM elements
   tableBody = $('<tbody></tbody>');
   
   for(var i=0;i<shelves;i++){
      curr_row=$('<tr></tr>');
      row_header = $('<th></th>');
      row_header.append(l.shelfNames[i]);//set row name
      curr_row.append(row_header);
      
      for(var j=0;j<maxBooks;j++){
         curr_cell=$('<td></td>');
         if(j<l.shelves[i].books.length){
            //set onclick handler
            curr_cell.click(handleBookClick);
            var book = l.shelves[i].books[j];
            curr_cell.append(book.title);
            curr_cell.attr('id', book.id);
            curr_cell.attr('bgColor', 
               book.availability? '#FFFFFF':
               (book.borrowedBy==getUser()? '#FF4444':
               '#FFAAAA'));
         }
         curr_row.append(curr_cell);
      }
      tableBody.append(curr_row);
   }
   bookTable.append(tableBody);
   
   destination = $('#table');
   destination.replaceWith(bookTable); 
}

var setTableClickHandlers = function(){
   $("#table td").click(handleBookClick);
}

//generates the text boxes and button that are only displayed upon admin authentication, potentially need an anchor to insertBefore with
var generateLibrarianFields = function(){
      addTitle = $("<input id='titleBox' name='titleBox' placeholder='Book Name' type='text'/>");
      addGenre = $("<input id='genreBox' name='genreBox' placeholder='Shelf' type='text'/>");
      addButton = $("<input id='submitButton' name='submitButton' type='button' value='Add Book'/>");

      addButton.click(function(){
         var title = $('#titleBox').val(); 
         var genre = $('#genreBox').val();
         var shelfNum = l.getShelfNum(genre);
         if(shelfNum != -1){
            l.addBook(new Book(title, shelfNum));
         } else {
            alert(genre + " is not a valid Shelf.");
         }
         updateTable();
         updateLocalStorage();
      });
      
      destination = $('body');
      destination.append(addTitle);
      destination.append(addGenre);
      destination.append(addButton);
}