function validate1(){
    var image1=getImage(firstCheck(document.forms["personalInfo"]["firstName"]),"First Name");
    document.getElementById("First Name").appendChild(image1)
   
   image1=getImage(lastCheck(document.forms["personalInfo"]["lastName"]),"Last Name");
   document.getElementById("Last Name").appendChild(image1);
   
   image1=getImage(genderCheck(document.forms["personalInfo"]["gender"]),"Gender");
   document.getElementById("Gender").appendChild(image1);
   
   image1=getImage(stateCheck(document.forms["personalInfo"]["state"]),"State");
   document.getElementById("State").appendChild(image1);
   
   //This links to the next document of contact information note we might need a delay here to give the user time to see the correct or wrong images displayed
   if(firstCheck(document.forms["personalInfo"]["firstName"]) && lastCheck(document.forms["personalInfo"]["lastName"]) && genderCheck(document.forms["personalInfo"]["gender"])
     && stateCheck(document.forms["personalInfo"]["state"])){
   //Need a delay here or fix logic to see images
        window.location.href = "./validation2.html";
      }

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
    //Don't need to check for blank box, implicit check for that in length check
    if(lastName.value.length<2){
        return false;
    }
    return true;
}

function genderCheck(gender){
    return gender.options[gender.selectedIndex].value=="male" || gender.options[gender.selectedIndex].value=="female" ? true : false;

}

function stateCheck(state){
    return state.options[state.selectedIndex].value=="ca" || state.options[state.selectedIndex].value=="fl" || state.options[state.selectedIndex].value=="ny" ||
        state.options[state.selectedIndex].value=="tx" || state.options[state.selectedIndex].value=="hi" || state.options[state.selectedIndex].value=="wa" ||
        state.options[state.selectedIndex].value=="co" || state.options[state.selectedIndex].value=="va" || state.options[state.selectedIndex].value=="ia" ||
        state.options[state.selectedIndex].value=="az" ? true : false;
}