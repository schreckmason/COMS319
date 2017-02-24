//Sanity check
//var user=localStorage.getItem('user');
//var librarian=localStorage.getItem('isAdmin');
//console.log(user);
//console.log(librarian);

class Library{
   //Map of shelf objects to allow books to be pushed to a structure
   constructor(){
      this.shelves = [new Shelf(), new Shelf(), new Shelf(), new Shelf()];
      this.shelfNames = ["Art", "Science", "Sport", "Literature"];
      // {
         // "art" : new Shelf(),
         // "science" : new Shelf(),
         // "sport" : new Shelf(),
         // "lit" : new Shelf()
      // };
      for(var i=0; i<25; i++){
         let b = new Book("B"+i);
         this.addBook(b);
      }
   }

   addBook(book){
      this.shelves[book.id%4].add(book);
      // //Switch statement instead
      // switch(book.id%4){
         // case 0:
            // this.shelves.art.add(book);
            // break;
         // case 1:
            // this.shelves.science.add(book);
            // break;
         // case 2:
            // this.shelves.sport.add(book);
            // break;
         // case 3:
            // this.shelves.lit.add(book);
            // break;
         // default:
            // alert("no valid book id found for "+book.name);
            // break;
      // }
   }
}

class Shelf{
   constructor(){
   this.books=[];
   }

   add(book){
      this.books.push(book);
   }
}

class Book{
   constructor(b){
      this.name = b;
      this.id = Math.floor(Math.random() * 1000);
      }
}

//Create an instance of a library to use
let l = new Library();
   console.log(l);

//make sure page is loaded (need user and isAdmin)
$(document).ready( function () {
   //No matter the credentials the table needs to be generated first, then changed and redrawn
   generateTable();
   
   if(localStorage.getItem('user')==='admin'){
      //generate librarian view
      generateLibrarianFields();
   }
   else{
      //generate student view
   }
});

//create initial table
function generateTable(){
   var maxBooks = 0;
   l.shelves.forEach(function(item){maxBooks = Math.max(item.books.length, maxBooks);});
   var shelves = 4;
   
   
   //Debugging for sanity checks and TA's can uncomment for ease of debugging
   //console.log(l.shelves[0].books);
   //console.log(l.shelves[1].books);
   //console.log(l.shelves[2].books);
   //console.log(l.shelves[3].books);

   //Table generation taken from test1.js but implemented with our class structure
   bookTable = $("<table border='2'></table>"); // creates DOM elements
   tableBody = $('<tbody></tbody>');
   
   for(var i=0;i<shelves;i++){
      curr_row=$('<tr></tr>');
      row_header = $('<th></th>');
      row_header.append(l.shelfNames[i]);//set row name
      curr_row.append(row_header);
      
      for(var j=0;j<maxBooks;j++){
         curr_cell=$('<td></td>');
         if(j<l.shelves[i].books.length){
            curr_cell.append(l.shelves[i].books[j].name);
         }
         console.log(curr_cell);
         curr_row.append(curr_cell);
      }
      tableBody.append(curr_row);
   }
   
   bookTable.append(tableBody);
   //#congrats is currently just a place holder (anchor) for insertBefore need a better convention
   bookTable.insertBefore($('#congrats')); 
}
//generates the text boxes and button that are only displayed upon admin authentication, potentially need an anchor to insertBefore with
function generateLibrarianFields(){
      addTitle = $("<input id='titleBox' name='titleBox' type='text'/>");
      addGenre = $("<input id='genreBox' name='genreBox' type='text'/>");
      addButton = $("<input id='submitButton' name='submitButton' type='button' value='Add Book'/>");
      //change to insertion after table, #congrats is currently just a placeholder
      addTitle.insertBefore($('#congrats'));
      addGenre.insertBefore($('#congrats'));
      addButton.insertBefore($('#congrats'));
      
      $('#submitButton').click(function(){
         //alert('clicked me');
         //handle adding a book to the table here
         //take two variables from text fields and construct a book object with them, and propagate them to Library
         //then call generateTable() again
         var title = $('#titleBox').val();  var genre = $('#genreBox').val().toLowerCase();//to assure a common-form
         console.log(title);
         console.log(genre);
         let addition = new Book(title);
         
         //need to force ID%4 here to put into correct categories (w/out changing object structure)
         l.addBook(addition);//my attempts to force a book into a given genre were sloppy, i provided the necessities though
         generateTable();//need a different method than this to update table neatly this is for testing
      });
      
}