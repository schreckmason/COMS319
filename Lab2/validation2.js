function validate2() {
    valCheck = true;
    var image1 = getImage(emailCheck(document.forms["contact information"]["email"].value), "email");
    document.getElementById("Email").appendChild(image1);

    if(numberField_1Check(document.forms["contact information"]["phone1"].value) && numberField_2Check(document.forms["contact information"]["phone2"].value)
        && numberField_3Check(document.forms["contact information"]["phone3"].value)){
        image1=getImage(true, "phone1");
        document.getElementById("Phone").appendChild(image1);
    }
    else{
        image1=getImage(false, "phone1");
        document.getElementById("Phone").appendChild(image1);
    }
    
    image1=getImage(addressCheck(document.forms["contact information"]["address"].value),"address");
    document.getElementById("Address").appendChild(image1);
    
    if(emailCheck(document.forms["contact information"]["email"].value) && numberField_1Check(document.forms["contact information"]["phone1"].value) &&
       numberField_2Check(document.forms["contact information"]["phone2"].value) && numberField_3Check(document.forms["contact information"]["phone3"].value)
       && addressCheck(document.forms["contact information"]["address"].value)){
        //Load map if all succeed
        window.location.href = "./track.html";
    }
}

function getImage(bool, ID) {
    var image = document.getElementById("image" + ID);
    if (image == null) {
        image = new Image(15, 15);
        image.id = "image" + ID;
    }
    image.src = bool ? './correct.png' : './wrong.png';
    return image;
}

function emailCheck(email) {
    atSplit = email.split('@');
    if (atSplit.length == 2 && alphaNumCheck(atSplit[0])) {
        periodSplit = atSplit[1].split('.')
        if (periodSplit.length == 2 && alphaNumCheck(periodSplit[0] + periodSplit[1])) {
            return true;
        }
    }
    valCheck = false;
    return false;
}

function alphaNumCheck(entry) {
    let regex = /^[a-z0-9]+$/i;
    if (entry != null && entry.match(regex)) {
        return true;
    } else {
        return false;
    }
}

function numberField_1Check(phone1){
    let regex = /^[0-9]+$/i;
    return ((phone1.lengh<3) || (!phone1.match(regex)) || (phone1==null)) ? false : true;
    }
    
function numberField_2Check(phone2){
    let regex = /^[0-9]+$/i;
    return ((phone2.length<3) || (!phone2.match(regex)) || (phone2==null)) ? false : true;
}

function numberField_3Check(phone3){
    let regex = /^[0-9]+$/i;
    return ((phone3.length<4) || (!phone3.match(regex)) || (phone3==null)) ? false : true;
    }

//Validate address in the form -- assuming the form (City, State) where State is IA, CO, VA, TX, HI or so on.
function addressCheck(address){
    var addressSplit = address.split(",");
    var cityOrigin = addressSplit[0];
    var stateOrigin = addressSplit[1];
    if(typeof(Storage)!=="undefined"){
        //Store variables
        localStorage.setItem("city", cityOrigin);
        localStorage.setItem("state",stateOrigin.toUpperCase());
    }
    
    if(address!=null){
        if(stateOrigin.trim().length!=2){
            alert("Please enter a valid state code.");
            return false;
        }
        else {
            return true;
        }
    }
}

function deleteCookie( name ) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
