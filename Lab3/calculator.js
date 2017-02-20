

//top-level object
var Calculator = {
    Model : {
        argument_1: undefined,//this is the first operand, also holds result in memeory during calculations
        operator : undefined,
        argument_2: undefined
      
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
        button0 : {id: "button0", type: "button", value: 0, onclick: ""},
        
        buttonClear : {id: "clear", type: "button", value: "C", onclick: ""},
        memoryClear : {id: "memclear", type: "button", value: "MC", onlick: ""},
        memRecall : {id: "memrecall", type: "button", value: "MR", onclick: ""},
        memSub : {id: "memsub", type: "button", value: "M-", onclick: ""},
        memAdd : {id: "memadd", type: "button", value: "M+", onclick: ""}
        
    },
    
    Controller : {
            //check model for old value to repeat on multiple clicks of '='
            //update DOM
        operand1_Handler : function(that){
            if(Calculator.Model.argument_1===undefined){
                Calculator.Model.argument_1 = that.value;
                console.log("operand1 "+ Calculator.Model.argument_1);
                resultRow.value+=Calculator.Model.argument_1;
            }
            else{
                Calculator.Model.argument_2 = that.value;
                console.log("operand2 "+Calculator.Model.argument_2);
                resultRow.value+=Calculator.Model.argument_2;
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
        Calculator.attachOperator();
        
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
        s = "<table id=\"myTable\" border=2>";
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
        
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.buttonClear);
        s += Calculator.displayElement(Calculator.View.memRecall);
        s += Calculator.displayElement(Calculator.View.memSub);
        s += "</td></tr>";
        
        s += "<tr><td>";
        s += Calculator.displayElement(Calculator.View.memAdd);
        s += Calculator.displayElement(Calculator.View.memoryClear);
        s += "</table>";
        return s;
    },

    attachHandlers : function() {
        for(var i=0;i<10;i++){
            Calculator.View["button"+i].onclick="Calculator.Controller.operand1_Handler(this)";
        }
        Calculator.Model.argument_1 = undefined;
        Calculator.View.buttonClear.onclick="Calculator.clearResultBox()";
        
        //This only works with a soft clear (C) not with MC
        Calculator.View.memRecall.onclick="Calculator.memoryRecall()";//must take place after result, so argument 1 currently holds result after first calculation
        Calculator.View.memoryClear.onclick="Calculator.clear()";//resets everything including result, MR will not work
        Calculator.View.memAdd.onclick="Calculator.memoryAdd()";
        Calculator.View.memSub.onclick="Calculator.memorySub()";
        

    },
    attachOperator : function(){
        Calculator.View.buttonAdd.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonSub.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonMult.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonDiv.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonDec.onclick="Calculator.Controller.operatorHandler(this)";
        Calculator.View.buttonEq.onclick="Calculator.getResult(Calculator.Model.argument_1,Calculator.Model.operator,Calculator.Model.argument_2)";
    },
    
    clear : function(){
        Calculator.Model.argument_1 = undefined;
        Calculator.Model.argument_2 = undefined;
        Calculator.Model.operator = undefined;
        Calculator.clearResultBox();
    },
    
    clearResultBox : function(){
      resultRow.value="";  
    },
    
    getResult : function(operand1, operator, operand2){
        Calculator.clearResultBox();
        var result;
        switch(operator){
            case "+":
                result = parseFloat(operand1)+parseFloat(operand2);
                resultRow.value=result;
                break;
            case "-":
                result = parseFloat(operand1)-parseFloat(operand2);
                resultRow.value=result;
                break;
            case "*":
                result = parseFloat(operand1)*parseFloat(operand2);
                resultRow.value=result;
                break;
            case "/":
                result = parseFloat(operand1)/parseFloat(operand2);
                resultRow.value=result;
                break;
            default:
                alert("Invalid operation");
        }
        Calculator.Model.argument_1 = result;
        console.log("arg1 : "+Calculator.Model.argument_1);
        Calculator.Model.operator=undefined;
    },
    
    memoryRecall : function(){
        if(Calculator.Model.argument_1!==undefined){
            resultRow.value=Calculator.Model.argument_1;
        }
        else{
            alert("nothing in memory, perhaps you used MC");
        }
    },
    
    memoryAdd : function(){
        var result = parseFloat(Calculator.Model.argument_2) + parseFloat(Calculator.Model.argument_1);//here, the argument_1 is what is held in memory
        console.log("M+ "+result);
        resultRow.value=result;
    },
    
    memorySub : function(){
        var result = parseFloat(Calculator.Model.argument_1)-parseFloat(Calculator.Model.argument_2);
        console.log("M- "+result);
        resultRow.value=result;
    }

    
}//end of Calculator