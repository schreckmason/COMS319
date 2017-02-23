

//top-level object
var Calculator = {
    Model : {
        argument : 0,
        memory : 0,
        operator : '+',
        argFirst : true,
        append : true
    },
    
    View : {
        buttonMult : {id: "buttonMult", type: "button", value: "*", onclick: ""},
        buttonAdd : {id: "buttonAdd", type: "button", value: "+", onclick: ""},
        buttonSub : {id: "buttonSub", type: "button", value: "-", onclick: ""},
        buttonDiv : {id: "buttonDiv", type: "button", value: "/", onclick: ""},
        buttonDec : {id: "buttonDec", type: "button", value: ".", onclick: ""},
        buttonEq : {id: "buttonEq", type: "button", value: "=", onclick: ""},
        
        display : {id: "display", type: "text", value:"", onclick:""},
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
        operand_handler : function(operand){
            //0123456789.
            if(!Calculator.Model.append){
                display.value = "";
                Calculator.Model.append = true;
                Calculator.Model.argFirst = true;
            }
            
            if(operand.value == "."){
                console.log("tried to add decimal; diplay = " + display.value);
                if(!display.value.includes('.')){
                    display.value += (display.value===""? "0":"") + "."
                }
            } else {
                display.value += operand.value;
            }
            
        },
        
        operator_handler : function(operator){
            console.log("operator: "+operator.value)
            Calculator.Model.argument = parseFloat(display.value);
            Calculator.Model.operator = operator.value;
            Calculator.Model.append = false;
            Calculator.Model.argFirst = true;
        },
        
        memory_add_handler : function(){
            Calculator.Model.memory += parseFloat(display.value);
        },
        
        memory_sub_handler : function(){
            Calculator.Model.memory -= parseFloat(display.value);
        },
        
        memory_clear_handler : function(){
            Calculator.Model.memory = 0;
        },
        
        memory_recall_handler : function(){
            display.value =  "" + Calculator.Model.memory;
            Calculator.Model.append = false;
        },
        
        clear_handler : function(){
            Calculator.Model.operator = '+';
            Calculator.Model.argument = 0;
            Calculator.Model.append = true;
            Calculator.Model.argFirst = false;
            display.value = "";
        },
        
        
        equals_handler : function(){
            var arg = [Calculator.Model.argument,
                       parseFloat(display.value)];
            if(!Calculator.Model.argFirst)
                arg = arg.reverse();
            var op = Calculator.Model.operator;
            
            console.log(arg);
            console.log(op);
            
            var result = 0;
            if(op === '+'){
                result = arg[0] + arg[1];
            } else if(op === '-'){
                result = arg[0] - arg[1];
            } else if(op === '*'){
                result = arg[0] * arg[1];
            } else {//(op === '/'){
                result = arg[0] / arg[1];
            }
            console.log(result);
            
            display.value = "" + result; 
            Calculator.Model.argument = arg[1];
            Calculator.Model.argFirst = false;
            Calculator.Model.append = false;
        }
        
        // getResult : function(operand1, operator, operand2){
            // Calculator.clearResultBox();
            // var result;
            // switch(operator){
                // case "+":
                    // result = parseFloat(operand1)+parseFloat(operand2);
                    // display.value=result;
                    // break;
                // case "-":
                    // result = parseFloat(operand1)-parseFloat(operand2);
                    // display.value=result;
                    // break;
                // case "*":
                    // result = parseFloat(operand1)*parseFloat(operand2);
                    // display.value=result;
                    // break;
                // case "/":
                    // result = parseFloat(operand1)/parseFloat(operand2);
                    // display.value=result;
                    // break;
                // default:
                    // alert("Invalid operation");
            // }
            // Calculator.Model.argument_1 = result;
            // console.log("arg1 : "+Calculator.Model.argument_1);
            // Calculator.Model.operator=undefined;
        // },
        
        // memoryRecall : function(){
            // if(Calculator.Model.argument_1!==undefined){
                // display.value=Calculator.Model.argument_1;
            // }
            // else{
                // alert("nothing in memory, perhaps you used MC");
            // }
        // },
        
        // memoryAdd : function(){
            // var result = parseFloat(Calculator.Model.argument_2) + parseFloat(Calculator.Model.argument_1);//here, the argument_1 is what is held in memory
            // console.log("M+ "+result);
            // display.value=result;
        // },
        
        // memorySub : function(){
            // var result = parseFloat(Calculator.Model.argument_1)-parseFloat(Calculator.Model.argument_2);
            // console.log("M- "+result);
            // display.value=result;
        // }
    },
    
    run : function(){
        Calculator.attachHandlers();
        
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
        s += "<tr><td>" + Calculator.displayElement(Calculator.View.display) + "</td></tr>";
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
            Calculator.View["button"+i].onclick="Calculator.Controller.operand_handler(this)";
        }
        Calculator.View.buttonDec.onclick="Calculator.Controller.operand_handler(this)";
        
        Calculator.View.memRecall.onclick="Calculator.Controller.memory_recall_handler(this)"
        Calculator.View.memoryClear.onclick="Calculator.Controller.memory_clear_handler(this)";
        Calculator.View.memAdd.onclick="Calculator.Controller.memory_add_handler(this)";
        Calculator.View.memSub.onclick="Calculator.Controller.memory_sub_handler(this)";
        
        Calculator.View.buttonAdd.onclick="Calculator.Controller.operator_handler(this)";
        Calculator.View.buttonSub.onclick="Calculator.Controller.operator_handler(this)";
        Calculator.View.buttonMult.onclick="Calculator.Controller.operator_handler(this)";
        Calculator.View.buttonDiv.onclick="Calculator.Controller.operator_handler(this)";
        
        Calculator.View.buttonEq.onclick="Calculator.Controller.equals_handler(this)";
        Calculator.View.buttonClear.onclick="Calculator.Controller.clear_handler(this)";
    }    
}