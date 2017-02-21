var Calculator = {
    Model : {
        operand: undefined,
        operator: undefined,
        append: true
    },
    View : {
        display : {id: "display", type: "text", value:"", onclick:""},
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
        binToDecimal : function(input){
            var positive = !input.startsWith('-');
            var charArray = input.slice(positive?0:1).split('');
            var result =0;
            for(var i=charArray.length-1; i>=0; i--){
                result += parseInt(charArray[i])*Math.pow(2,charArray.length-i-1);
            }
            return positive? result: -1*result;
        },
        
        decToBinary : function(num){
            bin = [];
            var positive = num >= 0;
            num = Math.abs(num);
            while(num!=0){
                bin.splice(0,0,num%2);
                num = Math.floor(num/2);
            }
            bin = bin.join("");
            return positive? bin: '-'+bin;
        },
        
        operand_handler : function(operand){
            if(Calculator.Model.append){//Calculator.Model.operator === undefined 
                display.value += operand.value;
            } else if(!Calculator.Model.append){//Calculator.Model.operator instanceof String 
                display.value = operand.value;
                Calculator.Model.append = true;
            }
        },
        
        unary_operator_handler : function(operator){
            if(operator.value === '~'){
                display.value = display.value.replace(/0/g, 'X').replace(/1/g, '0').replace(/X/g, '1');;
            } else if(operator.value === '>>'){
                display.value = '0' + display.value.slice(0, -1);
            } else {
                //left shift (<<)
                display.value = display.value.slice(1) + '0';
            }
        },
        
        binary_operator_handler : function(operator){            
            Calculator.Model.operand = Calculator.Controller.binToDecimal(display.value);
            Calculator.Model.operator = operator.value;
            Calculator.Model.append = false;
        },
        
        equals_handler : function(){
            var arg1dec = Calculator.Model.operand;
            var arg2bin = display.value;
            var op = Calculator.Model.operator;
            var binResult = undefined, decResult = undefined;
            
            if("=-*/%".includes(op)){
                //decimal operations
                var arg2dec = Calculator.Controller.binToDecimal(display.value);
                
                if(op === '+'){
                    decResult = arg1dec+arg2dec;
                } else if(op === '-'){
                    decResult = arg1dec-arg2dec;
                } else if(op === '*'){
                    decResult = arg1dec*arg2dec; 
                } else if(op === '/'){
                    decResult = Math.floor(arg1dec/arg2dec); 
                } else if(op === '%'){
                    decResult = arg1dec%arg2dec; 
                }
                binResult = Calculator.Controller.decToBinary(decResult);
            } else {
                //binary operations
                //result has number of digits same as longer operand
                var arg1bin = Calculator.Controller.decToBinary(arg1dec);
                var operand = [arg1bin, arg2bin];
                binResult = [];
                
                var maxLength = 0;
                operand.forEach(function(bitString, index, arr){
                        var positive = !bitString.startsWith('-');
                        arr[index] = 
                            {positive: positive,
                            bits: bitString.slice(positive?0:1).split('')};
                        maxLength = Math.max(maxLength, arr[index].bits.length);
                    });
                    
                console.log(operand);
                operand.forEach(function(op){
                    console.log(maxLength);
                    console.log(op);
                    op.bits = new Array(maxLength - op.bits.length).fill(0).concat(op.bits);});
                
                for(i=0; i < maxLength; i++){
                    var newBit;
                    if(op === '&'){
                        newBit = operand[0].bits[i] & operand[1].bits[i];
                    } else if(op === '|'){
                        newBit = operand[0].bits[i] | operand[1].bits[i];
                    }
                    binResult.push(newBit);
                }
                var positive = op==='&'?!operand[0].positive && !operand[1].positive: !operand[0].positive || !operand[1].positive;
                binResult = (positive?'':'-') + binResult.join('')
                decResult = Calculator.Controller.binToDecimal(binResult);
            }
            
            display.value = binResult; 
            Calculator.Model.operand = decResult;
            Calculator.Model.append = false;
        },
        clear_handler : function(){
            Calculator.Model.operator = undefined;
            Calculator.Model.operand = undefined;
            Calculator.Model.append = true;
            display.value = "";
        }
    },
    run :function(){
        Calculator.attachHandlers();
        // console.log(Calculator.display());
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
        s += "<tr><td>" + Calculator.displayElement(Calculator.View.display) + "</td></tr>";
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
        Calculator.View.button1.onclick="Calculator.Controller.operand_handler(this)";
        Calculator.View.button0.onclick="Calculator.Controller.operand_handler(this)";
        
        Calculator.View.buttonEq.onclick="Calculator.Controller.equals_handler(this)";
        
        Calculator.View.clear.onclick="Calculator.Controller.clear_handler(this)";
        
        var unary = ["inverse", "right", "left"];
        for(var i=0;i<unary.length;i++){
            Calculator.View[unary[i]].onclick="Calculator.Controller.unary_operator_handler(this)";
        }
        
        var binary = ["addition", "sub", "mult", "div", "modulus", "and", "or"];
        for(var i=0;i<binary.length;i++){
            Calculator.View[binary[i]].onclick="Calculator.Controller.binary_operator_handler(this)";
        }
    }
}