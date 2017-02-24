//Sanity check
//var user=localStorage.getItem('user');
//var librarian=localStorage.getItem('isAdmin');
//console.log(user);
//console.log(librarian);

class Library{
   //Map of shelf objects to allow books to be pushed to a structure
   constructor(){
      this.shelves = {
         "art" : new Shelf(),
         "science" : new Shelf(),
         "sport" : new Shelf(),
         "lit" : new Shelf()
      };
      for(var i=0; i<25; i++){
         let b = new Book("B"+i);
         this.addBook(b);
      }
   }

   addBook(book){
      //Switch statement instead
      switch(book.id%4){
         case 0:
            this.shelves.art.add(book);
            break;
         case 1:
            this.shelves.science.add(book);
            break;
         case 2:
            this.shelves.sport.add(book);
            break;
         case 3:
            this.shelves.lit.add(book);
            break;
         default:
            alert("no valid book id found for "+book.name);
            break;
      }
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
   var columns=4;
   var rows;
   
   //Me being lazy and not wanting to re-type all of this in conditionals
   var art = l.shelves.art.books.length;
   var science = l.shelves.science.books.length;
   var sport = l.shelves.sport.books.length;
   var literature = l.shelves.lit.books.length;
   
   //A way to assign the number of rows in our given table to a maximum of the largest shelf in the library
   if(art>=science && art>=sport && art>=literature){ rows = art;}
   else if(science>=art && science>=sport && science>=literature){rows = science; }
   else if(sport>=art && sport>=science && sport>=literature){rows = sport; }
   else{ rows = literature; }
   
   //Debugging for sanity checks and TA's can uncomment for ease of debugging
   //console.log(l.shelves.art.books);
   //console.log(l.shelves.science.books);
   //console.log(l.shelves.sport.books);
   //console.log(l.shelves.lit.books);

   //Table generation taken from test1.js but implemented with our class structure
   bookTable = $("<table border='2'></table>"); // creates DOM elements
   tableBody = $('<tbody></tbody>');
   for(var i=0;i<rows;i++){
      curr_row=$('<tr></tr>');
      for(var j=0;j<columns;j++){
         curr_cell=$('<td></td>');
         //I apologize for in-line writing, but I am cranking through this, I will fix this during the day tomorrow
         if(j===0 && i<art){ curr_text=l.shelves.art.books[i].name; curr_cell.append(curr_text); curr_row.append(curr_cell);}
         else if(j===1 && i<science) { curr_text=l.shelves.science.books[i].name; curr_cell.append(curr_text); curr_row.append(curr_cell);}
         else if(j===2 && i<sport) { curr_text=l.shelves.sport.books[i].name; curr_cell.append(curr_text); curr_row.append(curr_cell);}
         else if(j===3 && i<literature){ curr_text=l.shelves.lit.books[i].name; curr_cell.append(curr_text); curr_row.append(curr_cell);}
         //This is improper, but I wrote it this way to make sure my idea worked, need a 'default' else case here
      
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
         var title = $('#titleBox').val();
         var genre = $('#genreBox').val().toLowerCase();//to assure a common-form
         console.log(title);
         console.log(genre);
         let addition = new Book(title);
         
         //need to force ID%4 here to put into correct categories (w/out changing object structure)
         l.addBook(addition);//my attempts to force a book into a given genre were sloppy, i provided the necessities though
         generateTable();//need a different method than this to update table neatly this is for testing
      });
      
}