<html>
<head>
   <link rel="stylesheet" href="../css/signup.css">
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>
<body>
   <div id="logDiv">
      <h1>Please Login</h1>
      
      <p><div id="inUserDiv">User: <input type="text" id="inputUser"/></div></p>
      
      <p><div id="inPassDiv">Password: <input type="text" id="inputPass"/></div></p>
      
      <p><div><input type="button" id="loginButton" value="Login" onclick=""/></div></p>
   </div>
   <div id="statusDiv" style='color:red'></div>
</body>
   <script>
      //Post to PHP here
      $(document).ready(function(){
         $("#loginButton").click(function(){
            var username = $("#inputUser").val();
            console.log(username);
            var credentials={username: username, password: $("#inputPass").val()};
            $.post("./validateLogin.php",credentials, function(response, status){
               if(response==="Success"){
                  localStorage.setItem("user", username);
                  window.location.href = './blocks.php';
               }else{
                  $('#statusDiv').html("Invalid Password. Please try again.");
               }
            });
         });
      });
   </script>
</html>