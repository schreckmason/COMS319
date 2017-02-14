

//top-level object
var Calculator = {
    Model : {
      //keep old result here
        argument_1: undefined,
        operator : undefined,
        argument_2: undefined,
        tmp : undefined
      
    },
    
    View : {
        //label : {id: "label", type: "label", value: "Enter Expression", onclick: ""},
        buttonMult : {id: "buttonMult", type: "button", value: "*", onclick: ""},
        buttonAdd : {id: "buttonAdd", type: "button", value: "+", onclick: ""},
        buttonSub : {id: "buttonSub", type: "button", value: "-", onclick: ""},
        buttonDiv : {id: "buttonDiv", type: "button", value: "/", onclick: ""},
        buttonDec : {id: "buttonDec", type: "button", value: ".", onclick: ""},
        buttonEq : {id: "buttonEq", type: "button", value: "=", onclick: ""},
        
        resultRow : {id: "resultRow", type: "text", value:"", onclick:""},
        button9 : {id: "button9", type: "button", value: 9, onclick: ""},
        button8 : {id: "button8", type: "button", value: 8, onclick: ""},
        button7 : {id: "button7", type: "button", value: 7, onclick: ""},
        button6 : {id: "button6", type: "button", value: 6, onclick: ""},
        button5 : {id: "button5", type: "button", value: 5, onclick: ""},
        button4 : {id: "button4", type: "button", value: 4, onclick: ""},
        button3 : {id: "button3", type: "button", value: 3, onclick: ""},
        button2 : {id: "button2", type: "button", value: 2, onclick: ""},
        button1 : {id: "button1", type: "button", value: 1, onclick: ""},
        button0 : {id: "button0", type: "button", value: 0, onclick: ""}
        //need C, MR, M-, M+ and MC
    },
    
    Controller : {
            //check model for old value to repeat on multiple clicks of '='
            //update DOM
        operand1_Handler : function(that){
            if(Calculator.Model.argument_1===undefined){
                Calculator.Model.argument_1 = that.value;
                console.log("operand "+ Calculator.Model.argument_1);
                resultRow.value+=that.value;
                
            }
            if(Calculator.Model.argument_1!==undefined){
                Calculator.Model.tmp = Calculator.Model.argument_1;
                //Calculator.Model.argument_2 = Calculator.Model.argument_1;
                Calculator.Model.argument_1 = undefined;
            }
        },

        operatorHandler : function(that){
            if(Calculator.Model.operator===undefined){
                Calculator.Model.operator = that.value;
                console.log("Operator "+Calculator.Model.operator);
                resultRow.value+=that.value;
            }
        }

    },
    
    run : function(){
        Calculator.attachHandlers();
        //Calculator.getResult(Calculator.Model.argument_2,Calculator.Model.operator,Calculator.Model.argument1);//second gets first and first will result in second
        console.log(Calculator.display());
        return Calculator.display();
    },
    
    displayElement : function(element){
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
        s = "<table id=\"myTable\" border=2>"
        s += "<tr><td>" + Calculator.displayElement(Calculator.View.resultRow) + "</td></tr>";
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.button7);
        s += Calculator.displayElement(Calculator.View.button8);
        s += Calculator.displayElement(Calculator.View.button9);
        s += Calculator.displayElement(Calculator.View.buttonAdd);
        s += "</td></tr>";
        
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.button4);
        s += Calculator.displayElement(Calculator.View.button5);
        s += Calculator.displayElement(Calculator.View.button6);
        s += Calculator.displayElement(Calculator.View.buttonSub);
        s += "</td></tr>";
        
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.button1);
        s += Calculator.displayElement(Calculator.View.button2);
        s += Calculator.displayElement(Calculator.View.button3);
        s += Calculator.displayElement(Calculator.View.buttonMult);
        s += "</td></tr>";
        
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.button0);
        s += Calculator.displayElement(Calculator.View.buttonDec);
        s += Calculator.displayElement(Calculator.View.buttonEq);
        s += Calculator.displayElement(Calculator.View.buttonDiv);
        s += "</td></tr>";
        s += "</table>";
        return s;
    },

    attachHandlers : function() {
        //This will get the first operand after user-input
        ////This will get operator after first operand user-input
        for(var i=0;i<10;i++){
            Calculator.View["button"+i].onclick="Calculator.Controller.operand1_Handler(this)";
        }
        Calculator.View.buttonAdd.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonSub.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonMult.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonDiv.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonEq.onclick="Calculator.getResult(Calculator.Model.tmp,Calculator.Model.operator,Calculator.Model.argument_2)";
        Calculator.View.buttonDec.onclick="Calculator.Controller.operatorHandler(this)";
    },
    
    getResult : function(operand1, operator, operand2){
        if(operator=="+"){
            console.log(operand1+"+"+operand2);
        }
    }

    
}//end of Calculator