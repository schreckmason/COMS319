var Calculator = {
    Model : {
        
    },
    View : {
        resultRow : {id: "resultRow", type: "text", value:"", onclick:""},
        button1 : {id: "button1", type: "button", value: 1, onclick: ""},
        button0 : {id: "button0", type: "button", value: 0, onclick: ""},
        inverse : {id: "inverse", type: "button", value: "~", onclick: ""},
        addition : {id: "addition", type: "button", value: "+", onclick: ""},
        modulus : {id: "mod", type: "button", value: "%", onclick: ""},
        left : {id: "left", type: "button", value: "<<", onclick: ""},
        right : {id: "right", type: "button", value: ">>", onclick: ""},
        sub : {id: "sub", type: "button", value: "-", onclick: ""},
        and : {id: "and", type: "button", value: "&", onclick: ""},
        or : {id: "or", type: "button", value: "|", onclick: ""},
        mult : {id: "mult", type: "button", value: "*", onclick: ""},
        div : {id: "div", type: "button", value: "/", onclick: ""},
        memRecall : {id: "memrecall", type: "button", value: "MR", onclick: ""},
        memSub : {id: "memsub", type: "button", value: "M-", onclick: ""},
        memAdd : {id: "memadd", type: "button", value: "M+", onclick: ""},
        clear : {id: "clear", type: "button", value: "C", onclick: ""},
        memClear : {id: "memclear", type: "button", value: "MC", onclick: ""},
        buttonEq : {id: "buttonEq", type: "button", value: "=", onclick: ""}
    }, 
    Controller : {
        
    },
    run :function(){
        Calculator.attachHandlers();
        console.log(Calculator.display());
        return Calculator.display();
    },
    displayElement : function(element) {
        var s = "<input ";
        s += " id=\"" + element.id + "\"";
        s += " type=\"" + element.type + "\"";
        s += " value= \"" + element.value + "\"";
        s += " onclick= \"" + element.onclick + "\"";
        s += ">";
        return s;
    },
    display : function() {
        var s;
        s = "<table id=\"myTable\" border=2>";
        s += "<tr><td>" + Calculator.displayElement(Calculator.View.resultRow) + "</td></tr>";
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.button1);
        s += Calculator.displayElement(Calculator.View.button0);
        s += Calculator.displayElement(Calculator.View.inverse);
        s += "</td></tr>";
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.addition);
        s += Calculator.displayElement(Calculator.View.modulus);
        s += Calculator.displayElement(Calculator.View.left);
        s += "</td></tr>";
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.right);
        s += Calculator.displayElement(Calculator.View.sub);
        s += Calculator.displayElement(Calculator.View.and);
        s += "</td></tr>";
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.or);
        s += Calculator.displayElement(Calculator.View.mult);
        s += Calculator.displayElement(Calculator.View.div);
        s += "</td></tr>";
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.memRecall);
        s += Calculator.displayElement(Calculator.View.memSub);
        s += Calculator.displayElement(Calculator.View.memAdd);
        s += "</td></tr>";
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.clear);
        s += Calculator.displayElement(Calculator.View.memClear);
        s += Calculator.displayElement(Calculator.View.buttonEq);
        s+= "</td></tr>";
        s += "</table>";
        return s;
    },
    attachHandlers : function() {
        
    },
    attachOperator : function() {
        
    },
    
    convertToDecimal : function(input){
        var charArray = input.split('');
        var result =0;
        for(var i=charArray.length-1; i>=0; i--){
            var count=0;
            if(parseInt(charArray[i]==1)){
                result += charArray[i]*Math.pow(2,count);
            }
            count++;
        }
    }

}