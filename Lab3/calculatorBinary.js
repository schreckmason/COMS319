var Calculator = {
    Model : {
        operand: 0,
        operator: '+',
        memory: 0,
        append: true,
        opFirst: true
        
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
            if(input==='')
                return 0;
            var positive = !input.startsWith('-');
            var charArray = input.slice(positive?0:1).split('');
            var result =0;
            for(var i=charArray.length-1; i>=0; i--){
                result += parseInt(charArray[i])*Math.pow(2,charArray.length-i-1);
            }
            return positive? result: -1*result;
        },
        
        decToBinary : function(num){
            if(num===0)
                return 0;
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
                Calculator.Model.opFirst = true;
            }
        },
        
        unary_operator_handler : function(operator){
            // leave sign alone
            if(operator.value === '~'){
                display.value = display.value.replace(/0/g, 'X').replace(/1/g, '0').replace(/X/g, '1');;
            } else if(operator.value === '>>'){
                var pos = !display.value.startsWith('-');
                display.value = (pos?'':'-') + '0' + display.value.slice(pos?0:1, -1);
            } else {
                //left shift (<<)
                var pos = !display.value.startsWith('-');
                display.value = (pos?'':'-') + display.value.slice(pos?1:2) + '0';
            }
        },
        
        binary_operator_handler : function(operator){
            console.log("binary operator: "+operator.value)
            Calculator.Model.operand = Calculator.Controller.binToDecimal(display.value);
            Calculator.Model.operator = operator.value;
            Calculator.Model.append = false;
            Calculator.Model.opFirst = true;
        },
        
        memory_add_handler : function(){
            Calculator.Model.memory += Calculator.Controller.binToDecimal(display.value);
        },
        
        memory_sub_handler : function(){
            Calculator.Model.memory -= Calculator.Controller.binToDecimal(display.value);
        },
        
        memory_clear_handler : function(){
            Calculator.Model.memory = 0;
        },
        
        memory_recall_handler : function(){
            display.value =  Calculator.Controller.decToBinary(Calculator.Model.memory);
            Calculator.Model.append = false;
        },
        
        equals_handler : function(){
            var arg = [{bin: undefined, dec: undefined},
                       {bin: undefined, dec: undefined}];
            var result = {bin: undefined, dec: undefined};
            var op = Calculator.Model.operator;
            console.log(arg);
            if(Calculator.Model.opFirst){
                arg[0].dec = Calculator.Model.operand;
                arg[1].bin = display.value;
            } else {
                arg[0].bin = display.value;
                arg[1].dec = Calculator.Model.operand;
            }
            console.log(arg);
            console.log(op);
            if("+-*/%".includes(op)){
                //decimal operations
                arg.forEach(function(op){
                    if(op.dec === undefined)
                        op.dec = Calculator.Controller.binToDecimal(op.bin);
                });
                
                if(op === '+'){
                    result.dec = arg[0].dec+arg[1].dec;
                } else if(op === '-'){
                    result.dec = arg[0].dec-arg[1].dec;
                } else if(op === '*'){
                    result.dec = arg[0].dec*arg[1].dec; 
                } else if(op === '/'){
                    var temp = arg[0].dec/arg[1].dec;
                    result.dec = temp>0? Math.floor(temp): Math.ceil(temp); 
                } else if(op === '%'){
                    result.dec = arg[0].dec%arg[1].dec; 
                }
                result.bin = Calculator.Controller.decToBinary(result.dec);
            } else {
                //binary operations (result has number of digits same as longer operand)
                
                var maxLength = 0;
                // Define all binary strings; remove any sign; replace binary strings with map of bits and sign; update max length of bits
                arg.forEach(function(op){
                    var bitString = op.bin === undefined? Calculator.Controller.decToBinary(op.dec): op.bin;
                    op.dec = op.dec === undefined? Calculator.Controller.binToDecimal(op.bin): op.dec;
                    var positive = !bitString.startsWith('-');
                    op.bin = 
                        {positive: positive,
                         bits: bitString.slice(positive?0:1).split('')};
                    maxLength = Math.max(maxLength, op.bin.bits.length);});
                    
                // Pad all bit strings to the same length with leading zeros
                arg.forEach(function(op){
                    op.bin.bits = new Array(maxLength - op.bin.bits.length).fill('0').concat(op.bin.bits);});
                    
                result.bin = [];
                for(i=0; i < maxLength; i++){
                    var newBit;
                    if(op === '&'){
                        newBit = arg[0].bin.bits[i] & arg[1].bin.bits[i];
                    } else if(op === '|'){
                        newBit = arg[0].bin.bits[i] | arg[1].bin.bits[i];
                    }
                    result.bin.push(newBit);
                }
                var posRes = arg[0].bin.positive || arg[1].bin.positive;//TODO
                result.bin = (posRes?'':'-') + result.bin.join('')
                result.dec = Calculator.Controller.binToDecimal(result.bin);
            }
            
            console.log(result);
            display.value = result.bin; 
            Calculator.Model.operand = arg[1].dec;
            Calculator.Model.opFirst = false;
            Calculator.Model.append = false;
        },
        clear_handler : function(){
            Calculator.Model.operator = '+';
            Calculator.Model.operand = 0;
            Calculator.Model.append = true;
            Calculator.Model.opFirst = false;
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
        
        Calculator.View.memRecall.onclick="Calculator.Controller.memory_recall_handler(this)";
        Calculator.View.memClear.onclick="Calculator.Controller.memory_clear_handler(this)"
        Calculator.View.memAdd.onclick="Calculator.Controller.memory_add_handler(this)"
        Calculator.View.memSub.onclick="Calculator.Controller.memory_sub_handler(this)"
        
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