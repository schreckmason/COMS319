//wait for DOM elements to be loaded to begin using them
$(document).ready(function(){
    //Need to store isAdmin, and username while redundant for admin (isAadmin=1, user=admin) necessary for students (isAdmin=0, user=[NAME_HERE])
   function login(){
    var user = $('#usernameBox').val();//username
    var pass = $('#passwordBox').val();//password
    if(user.toLowerCase() === 'admin'){
        //Check password, note that no case assumptions are made, password MUST match 'admin' for the login to succeed as admin
        if(typeof(Storage)!=='undefined'){
            switch(pass){
                case 'admin':
                    localStorage.setItem('user', user);
                    localStorage.setItem('isAdmin', true);
                    window.location.href='./booksLibrary.html';

                    break;
                default:
                    console.log('admin authentication failed');//for ease of TA debugging
                    localStorage.setItem('user', 'admin_auth_failure');
                    localStorage.setItem('isAdmin', 'admin_auth_failure');
            }
        }
        
    }
    
    //In this case (per lack of instruction) password is not checked
    else if(user.startsWith('U')){
        var nameArray = user.split('U');//allows us to trim username based upon U and provides a sanity check of only one 'U' per name -> Umason or UDrake, and not UUmason
        if(typeof(Storage)!=='undefined'){
            //This is a more succinct way of doing what is commented out below
            localStorage.setItem('user', nameArray[nameArray.length-1].toLowerCase());//saves the username, gets correct name no matter how many student tokens are used (U)
            localStorage.setItem('isAdmin', false);
            window.location.href='./booksLibrary.html';
        }
        //console.log(nameArray[nameArray.length-1].toLowerCase());
        //if(nameArray.length==2){
        //    console.log(nameArray[1].toLowerCase());//save this username
        //}
        ////I am unsure of how to accomodate such names as Usain, UUsain for instance
        //else{
        //    alert('Too many student identifiers (U)');
        //}
    }
    else{
        alert('Invalid user');
    }
   }
   
   //on button click, do user validation based upon contents of text boxes
   $('#login').click(function(){
    login();
    //For debugging
    //console.log(localStorage.getItem('user'));
    //console.log(localStorage.getItem('isAdmin'));
   });
    
});