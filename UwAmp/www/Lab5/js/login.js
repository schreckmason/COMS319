
//make convenience function for jquery
$.fn.exists = function () {
    return this.length !== 0;
}

$(document).ready(function() {
   $("#submitLogin").click(checkLogin);
   $("#newSignUp").click(createUser);
});

//Do signup here
createUser = function(){
    var newUser = {name: $("#name").val(), password: $("#password").val()};
      $.post("../php/createUser.php", newUser ,function(response,status){
         if(response =="success"){
            window.location="../php/login.php";
         }
         else{
            //should only fail if user already exists
         }
      });
};

checkLogin = function() {
   $.post("../php/checkLogin.php", {name : $("#name").val(), password : $("#password").val()}, 
      function(data, status) {
        if(data == "success"){
            viewPosts();
        }
        else{
            $("#tryAgain").html('<p style="color:red;">Wrong. Try Again</p>');
        }
      }
   );
};

function viewPosts(){
   $.post("../php/viewPosts.php",
      function(data,status){        
         //handle signInDiv
         if(!$("#destroy").exists()){
            $("#signInDiv").html("<input id=\"destroy\" type=\"button\" value=\"Logout\"/><br><br>");
            $("#destroy").click(function () {
               $.post("../php/logout.php", null, 
                  function(data,status) { 
                     location.reload();
               });
            });
         }
         
        //append inbox button
        if(!$("#inboxButton").exists()){
            $("#inboxDiv").html("<input id=\"inboxButton\" type=\"button\" value=\"Inbox\"/><br><br>");
            $("#inboxButton").click(function(){
                $.post("../php/inbox.php", null,
                       function(data,status){
                        //alert(data);
                        // console.log(data);
                        $("#messages").html(data);
                });
            });
        }
         
         //handle posts table
         $("#posts").html(data);
         var tableSize = $('#posts tbody tr').length;
         for (var i=0; i<tableSize; i++) {
            $("#entry"+i).click((function () {
               var postNum = i;
                  return function(){
                  var tr = $("tr").eq(postNum);
                  editPost(tr);
               }
            })());
         }
         createMakePostButton();
         createMessageButton();
   });
};

function makeEditDialogue(domTableRow){
   //domTableRow is a dom element containing the post to edit
   var td = domTableRow.find("td").eq(0);
   //var post = JSON.parse(postJson);
   var divs = td.find("div");
   var post = new Object();
   post.title = divs.eq(0).html();
   post.author = divs.eq(1).html();
   post.time = divs.eq(2).html();
   post.message = divs.eq(3).html();
   var newMsg = prompt("Edit post: " + post.title + "\n" +
   "Original post by " + post.author + " at " + post.time,
   post.message);
   if (newMsg != null) {
      post.message = newMsg;
   }
   
   return post;
}

function editPost(domTableRow){
   var post = makeEditDialogue(domTableRow);
   //send the updated post to server with updatePosts.php
   $.post("../php/updatePosts.php",post,function(data,status){
      viewPosts();
   });
}

var createNewPostForm = function (){
   var newPostForm = "Title: <input id=\"postTitle\" type=\"text\" name=\"name\" value=\"\"/><br>"+
   "Message: <input id=\"postMsg\" type=\"text\" name=\"password\" value=\"\"/><br>"+
   "<input id=\"submitCreatePost\" type=\"button\" value=\"Post\"/>";
   $("#createPostDiv").html(newPostForm);
   $("#submitCreatePost").click(function () {
      var newPost = {title: $("#postTitle").val(), message:$("#postMsg").val(),author: "", time: new Date().toUTCString()};
      $.post("../php/updatePosts.php", newPost,function(data,status){
         console.log(data);
         viewPosts();
         createMakePostButton();
      });
   });
}
var createMakePostButton = function (){
   $("#createPostDiv").html("<input id=\"createPost\" type=\"button\" value=\"make a post\"/>");
   $("#createPost").click(function (){
      createNewPostForm();
   });
}

var createNewMessageForm = function(){
   var newMsgForm = "To: <input id=\"msgRecipient\" type=\"text\" value=\"\"/><br>"+
   "Body: <input id=\"msgContent\" type=\"text\" value=\"\"/><br>"+
   "<input id=\"sendMsg\" type=\"button\" value=\"Send\"/>";
   $("#createMsgDiv").html(newMsgForm);
   $("#sendMsg").click(function () {
        var newMessage = {recipient: $("#msgRecipient").val(), message: $("#msgContent").val()};
        $.post("../php/sendMessage.php",newMessage,function(response,status){
           console.log(response);
           viewPosts();
           createMessageButton();
        });
   });
}

var createMessageButton = function(){
    $("#createMsgDiv").html("<input id=\"createMsg\" type=\"button\" value=\"Draft Msg\"/>");
    $("#createMsg").click(function(){
        createNewMessageForm();
    });
}