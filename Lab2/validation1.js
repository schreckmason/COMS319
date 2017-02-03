function validate1(){
   // String id, function checker, String val
   var checks = [
   ["First Name", alphaNumCheck, document.forms["personalInfo"]["firstName"].value],
   ["Last Name", alphaNumCheck, document.forms["personalInfo"]["lastName"].value],
   ["Gender", genderCheck, getSelection(document.forms["personalInfo"]["gender"])],
   ["State", stateCheck, getSelection(document.forms["personalInfo"]["state"])]];
   
   var allPassed = true;
   checks.forEach(function(arr){
      var id = arr[0];
      var func = arr[1];
      var val = arr[2];
      var success = func(val);
      allPassed &= success;
      var img = getImage(success, id);
      document.getElementById(id).appendChild(img);
   });
   
   if(allPassed){
      //proceed after 1.5 seconds
      setTimeout(function() {
         localStorage.setItem("state1",tateOrigin.toUpperCase());
         window.location.href = "./validation2.html";
      }, 1500);
   }

}

function getSelection(e){
   return e.options[e.selectedIndex].value;
}

//Function that will return green check if true, red x if otherwise
function getImage(bool, ID){
    var image=document.getElementById("image "+ID);
    if(image==null){
        image=new Image(15,15);
        image.id="image "+ID;
    }
    image.src=bool ? './correct.png' : './wrong.png'
    return image;
}

function alphaNumCheck(entry) {
    let regex = /^[a-z0-9]+$/i; // 1 or more alphanumeric character (nothing else)
    var success = entry != null && entry.match(regex) != null;
    return success;
}

function genderCheck(gender){
    return ['male', 'female'].includes(gender);
}

function stateCheck(state){
   var states = ["ca", "fl", "ny", "tx", "hi", "wa", "co", "va", "ia", "az"];
   return states.includes(state);
}