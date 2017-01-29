function validate1(){
    var valCheck=true;
    var image1=setImage(firstCheck(document.forms["personalInfo"]["firstName"]));
    document.getElementById("First Name").appendChild(image1)
   
   image1=setImage(lastCheck(document.forms["personalInfo"]["lastName"]));
   document.getElementById("Last Name").appendChild(image1);
}

function firstCheck(firstName){
    //only checks for a blank box, input a length check and special character check here
    if(firstName.value==''){
        return false;
    }
    return true;
}

function lastCheck(lastName){
    if(lastName.value==''){
        return false;
    }
    return true;
}

function setImage(bool){
    image=new Image(15,15);
    image.src=bool ? "./correct.png" : './wrong.png'
    return image;
}