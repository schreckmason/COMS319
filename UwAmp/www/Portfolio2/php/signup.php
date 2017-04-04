<html>
   <link rel="stylesheet" href="../css/signup.css">
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
   <!--Everything is wrapped in a seperate div in case we want to do error reporting based upon those specific input areas-->
   <div id="mainDiv">
     <h1>Register Yo'Self</h1>
     <p><div id="userDiv">User Name: <input id="username" type="text"></div></p>
     
     <p><div id="passDiv">Password: <input id="password" type="text" ></div></p><!--Store me as md5()-->
     
     <p><div>Confirm: <input id="passConfirm" type="text"></div></p>
     
     <p><div id="emailDiv">Email: <input id="email" type="text"></div></p>
     
     <p><div><input id="connectButton" type="button" value="connect"></div></p>
   </div>
   <div id="statusDiv" style='color:red'></div>
   <script>
      $(document).ready(function(){
         $("#connectButton").click(function(){
            if(checkFields()){
               registerUser($("#username").val(), $("#password").val(), $("#email").val());
            }
         });
      });
      function checkFields(){
         var success = true;
         var pwd = $("#password").val();
         var confirmPwd = $("#passConfirm").val();
         if(pwd !== confirmPwd){
            success = false;
            $('#statusDiv').html("Passwords aren't identical. Please try again.");
         }
         email_fmt = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
         if(false){//!email_fmt.test(email)
            $('#statusDiv').html("Invalid email. Please try again.");
            success = false;
         }
         return success;
      }
      function registerUser(userName, password, email){
         var user = {userName: userName, password: password, email: email};
         $.post("./register.php", user, function(response, status){
            $('#statusDiv').html(response);
            if(response=="success"){
               window.location.href = './login.php';
            }
         });
      }
   </script>
</html>