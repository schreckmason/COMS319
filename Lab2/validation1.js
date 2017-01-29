function validate1(){
    var valCheck=true;
    var image1=getImage(firstCheck(document.forms["personalInfo"]["firstName"]),"First Name");
    document.getElementById("First Name").appendChild(image1)
   
   image1=getImage(lastCheck(document.forms["personalInfo"]["lastName"]),"Last Name");
   document.getElementById("Last Name").appendChild(image1);
}

//Function that will return green check if true, red x if otherwisre
function getImage(bool, ID){
    var image=document.getElementById("image"+ID);
    if(image==null){
        image=new Image(15,15);
        image.id="image"+ID;
    }
    image.src=bool ? './correct.png' : './wrong.png'
    return image;
}

function firstCheck(firstName){
    //Don't need to check for blank box, implicit check for that in length check
    if(firstName.value.length<2){
        return false;
    }
    return true;
}

function lastCheck(lastName){
    if(lastName.value.length<2){
        return false;
    }
    return true;
}