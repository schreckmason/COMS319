var getUser = function(){
   return localStorage.getItem('user');
}

var userLibrarian = function(){
   return localStorage.getItem('userType')=="Librarian";
}

$(document).ready( function () {
   tablePlaceHolder = $("<div id='tableDiv'/>");
   descDiv = $("<div id='bookDescription' />");
   $('body').append(tablePlaceHolder);
   $('body').append($('<br/>'));
   $('body').append(descDiv);
   $('body').append($('<br/>'));
   
   if(userLibrarian()){
      generateLibrarianFields();
   } else {
      generateStudentFields();
   }
   
   refreshTable();
});

var refreshTable = function(){
   $.post("getBooks.php", {},
      function(data,status){
         $("#tableDiv").html(data);
         //set click handler for non-empty table cells
         $("#table td").filter(function(i, el){return el.textContent!="";}).click(handleBookClick);
         cellSelection = undefined;
         setStudentButtons("unselected");
      });
}

var handleBookClick = function(){
   var desc = this.textContent + " is written by " + this.getAttribute("author") +
      " and is currently " + (this.getAttribute("availability")=="true"? "on the shelf": "checked out by " + this.getAttribute("borrowedBy")) + ".";
   $('#bookDescription').text(desc);
   selectTableCell(this);
}

var selectTableCell = function(tableCell){
   var mode;
   if(cellSelection != undefined){
      // a cell is currently selected
      cellSelection.bgColor = cellSelection.getAttribute("availability")=="true"?'#FFFFFF':'#FF9999'; //unselect cell
   }
   if(cellSelection == undefined || tableCell.id != cellSelection.id){
      // selecting a new cell
      tableCell.bgColor = '#BBBBBFF';
      cellSelection = tableCell;
      mode = tableCell.getAttribute("availability")=="true"?"available":(tableCell.getAttribute("borrowedBy")==getUser()?"borrowed":"unavailable");
      libMode = "selected";
   } else {
      // unselecting currently selected cell
      cellSelection = undefined;
      mode = "unselected";
   }
   setStudentButtons(mode);
}

var setStudentButtons = function(mode){
   console.log(mode);
   switch(mode){
      case "available":
         $("#returnButton").css("display", "none");
         $("#borrowButton").css("display", "block");
         $("#borrowButton").prop("disabled", false);
         break;
      case "unavailable":
         $("#returnButton").css("display", "none");
         $("#borrowButton").css("display", "block");
         $("#borrowButton").prop("disabled", true);
         break;
      case "borrowed":
         $("#returnButton").css("display", "block");
         $("#borrowButton").css("display", "none");
         break;
      case "unselected":
         $("#returnButton").css("display", "none");
         $("#borrowButton").css("display", "none");
         break;
      default:
         console.log("error");
   }
}

//generates the text boxes and button that are only displayed upon librarian authentication
var generateLibrarianFields = function(){
   librarianDiv = $("<div id='librarianDiv'></div>");
   bookIdBox = $("<input id='bookIdBox' placeholder='Book ID' type='text'/>");
   titleBox = $("<input id='titleBox' placeholder='Title' type='text'/>");
   authorBox = $("<input id='authorBox' placeholder='Author' type='text'/>");
   addBookButton = $("<input id='addBookButton' type='button' value='Add Book'/>");
   //delete button
   deleteBookButton = $("<input id='deleteBookButton' type='button' value='Delete Book'/>");
   //view loanhistory of provided user
   userBox = $("<p><input id = 'userNameBox' placeholder='User' type='text'/></p>");
   historyButton = $("<input id = 'historyButton' type='button' value='View History'/>");
   
   historyDiv = $("<div id='loanHistory'><br></div");
   historyHolder = $("<table id='historyTable' border='1'></table>");
   

   addBookButton.click(function(){
      var id = $('#bookIdBox').val(); 
      var title = $('#titleBox').val(); 
      var author = $('#authorBox').val();
      
      $.post("addBook.php", {id: id, title: title, author: author},
         function(data,status){
            refreshTable();
         });
   });
   
   deleteBookButton.click(function(){
      if(cellSelection===undefined){alert("Please select a book from the table you wish to remove."); return;}
      $.post("../php/deleteBook.php", {id: cellSelection.id},
             function(response){
               console.log(response);
               refreshTable();
             });
   });
   
   historyButton.click(function(){
         $.post("../php/getLoanHistory.php",{user: $('#userNameBox').val()},
                function(response){
                  $('#historyTable').html(response);
                  //historyDiv.html(response);
                  console.log(response);
                });
   });
   
   librarianDiv.append(bookIdBox);
   librarianDiv.append(titleBox);
   librarianDiv.append(authorBox);
   librarianDiv.append(addBookButton);
   librarianDiv.append(deleteBookButton);
   librarianDiv.append(userBox);
   librarianDiv.append(historyButton);
   $('body').append(librarianDiv);
   historyDiv.append(historyHolder);
   
   $('body').append(historyDiv);
}

var generateStudentFields = function(){
   studentDiv = $("<div id='studentDiv'></div>");
   borrowButton = $("<input id='borrowButton'type='button' value='Borrow' />");
   returnButton = $("<input id='returnButton' type='button' value='Return' />");
   
   borrowButton.click(function(){
      $.post("../php/borrowBook.php", {id: cellSelection.id},
         function(data,status){
            refreshTable();
         });
      $.post("../php/updateLoanHistory.php", {id: cellSelection.id, user: localStorage.getItem("user")},
             function(response){
               console.log(response);
             });
   });
   
   returnButton.click(function(){
      var id = $('#bookIdBox').val(); 
      var title = $('#titleBox').val(); 
      var author = $('#authorBox').val();
      
      $.post("../php/returnBook.php", {id: cellSelection.id},
         function(data,status){
            refreshTable();
         });
   });
   studentDiv.append(borrowButton);
   studentDiv.append(returnButton);
   $('body').append(studentDiv);
}