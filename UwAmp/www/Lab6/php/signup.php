<html>
    <link rel="stylesheet" href="../css/signup.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!--Everything is wrapped in a seperate div in case we want to do error reporting based upon those specific input areas-->
    <div id="mainDiv">
        <h1>Register Yo'Self</h1>
        <p><div id="userDiv">User Name: <input id="username" type="text" pattern="[A-Za-z0-9]" required></div></p>
        
        <p><div id="passDiv">Password: <input id="password" type="text" pattern="" required></div></p><!--Store me as md5()-->
        
        <p><div>Confirm: <input id="passConfirm" type="text" pattern="" required></div></p>
        
        <p><div id="emailDiv">Email: <input id="email" type="text" pattern="[A-Za-z0-9]{3}@[A-Za-z0-9]{3}\.[A-Za-z0-9]{3}" required></div></p>
        
        <p><div id="phoneDiv">Phone: <input id="phone" type="text" pattern="" required></div></p>
        
        <p><div id="libDiv">Librarian: <input id="librarian" type="checkbox" required></div></p>
        
        <p><div id="fnameDiv">First Name: <input id="firstName" type="text" pattern="[A-Za-z]" required></div></p>
        
        <p><div id="lnameDiv">Last Name: <input id="lastName" type="text" pattern="[A-Za-z]" required></div></p>
        
        <p><div><input id="connectButton" type="button" value="connect"></div></p>
    </div>
    <div id="statusDiv"></div>
    <script>
        $(document).ready(function(){
                       //store isLib as 0 - false or 1-true
            //if($("#librarian").checked){islib=1;}
            //else{islib=0;}

           $("#connectButton").click(function(){
            var islib;
            if($("#librarian").is(':checked')){islib=1;}
            else{islib=0;
            }
            var user = {userName: $("#username").val(), password: $("#password").val(), passConfirm: $("#passConfirm").val(), email: $("#email").val(),
            phone: $("#phone").val(), isLib: islib, fName: $("#firstName").val(), lName: $("#lastName").val()};
                $.post("./register.php",user,
                       function(response, status){
                        $('#statusDiv').html(response);//TODO: Redirect to login?
                        if(response=="success"){
                            window.location.href = './login.php';
                        }
                       });
                
           });
        });
    </script>
</html>