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
    <!--FOR DEBUGGING REMOVE ME WHEN THE TIME IS RIGHT-->
    <div id="statusDiv"></div>
</body>
    <script>
        //Post to PHP here
        $(document).ready(function(){
           $("#loginButton").click(function(){
                var credentials={username: $("#inputUser").val(), password: $("#inputPass").val()};
                $.post("./validateLogin.php",credentials,
                       function(response,status){
                        //$("#statusDiv").html(response);//make the result viewable for now, when it is working have it redirect to new page for library
                        if(response==="Success"){
                            window.location.href = './library.php';
                        }else{
                            
                        }
                       });
           });
        });
    </script>
</html>