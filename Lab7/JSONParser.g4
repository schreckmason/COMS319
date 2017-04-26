//to parse JSON files
lexer grammar JSONParser;

@lexer::header {
  import java.util.List;
  import java.util.Arrays;
  import java.util.ArrayList;
}

@members {
    public class ErrorList extends ArrayList<String>{
        public String toString(){
            String output = "";
            for(int i = 0; i < this.size(); i++){
                output += this.get(i);
            }
            return output;
        }
        public void printErrors(){
            if(!this.isEmpty() && this.toString().trim().length() > 0){
                System.out.println("Error: " + this.toString());
                this.clear();
            }
        }
    }
    public ErrorList errors = new ErrorList();
}

fragment QUOTE: '"';
fragment COLON: ':';
fragment COMMA: ',';
fragment DIGIT: [0-9];

/*********************************/
/*              EMAIL            */
/*********************************/
fragment LOCALCHAR: [A-Za-z0-9-_~!$&'()*+,;=:];
fragment LOCALPART: LOCALCHAR ('.'? LOCALCHAR)*;
fragment DOMAINCHAR: [A-Za-z0-9.-];
fragment DOMAINPART: DOMAINCHAR+;

fragment EMAIL: LOCALPART '@' DOMAINPART ;

fragment EMAILKEY: QUOTE 'EMAIL' QUOTE COLON;
EMAILTOKEN: EMAILKEY SPACE* QUOTE EMAIL QUOTE ','? {errors.printErrors(); System.out.println("EMAIL: "+getText());};

/*********************************/
/*             DATE              */
/*********************************/
fragment SLASH: '/';
fragment DAY: [0][1-9] | [12][0-9] | [3][01]; // 1 <= day <= 31
fragment MONTH: [0][1-9] | [1][0-2]; // 1 <= month <= 12
fragment YEAR: [2]('100' | [0] DIGIT DIGIT); // 2000 <= year <= 2100
fragment DATE: DAY SLASH MONTH SLASH YEAR;

fragment DATEKEY: QUOTE 'DATE' QUOTE COLON;
DATETOKEN: DATEKEY SPACE* QUOTE DATE QUOTE ','? {errors.printErrors(); System.out.println("DATE: "+getText());};

/*********************************/
/*             PHONE             */
/*********************************/
fragment D3: DIGIT DIGIT DIGIT;
fragment D4: D3 DIGIT;

//Form 1: ###-###-####
fragment FORM1: D3 [-] D3 [-] D4;
//Form 2: (###) ###-####
fragment FORM2: '(' D3 ')' SPACE? D3 [-] D4;
//Form 3: ### ### ####
fragment FORM3:  D3 [ ] D3 [ ] D4;
//Form 4: ###.###.####
fragment FORM4:  D3 [.] D3 [.] D4;

fragment PHONE: FORM1 | FORM2 | FORM3 | FORM4;

fragment PHONEKEY: QUOTE 'PHONE' QUOTE COLON;
PHONETOKEN: PHONEKEY SPACE* QUOTE PHONE QUOTE ','? {errors.printErrors(); System.out.println("PHONE: "+getText());};

/*********************************/
/*          CREDIT CARD          */
/*********************************/
//USE DIGIT
fragment D11: D4 D4 D3;
fragment D12: D4 D4 D4;
fragment D13: D4 D3 D3 D3;
fragment D14: D4 D4 D3 D3;

fragment VISA: '4' D12 D3?; // 13 or 16 digits
fragment MASTERCARD: [5][1-5] D14;
fragment AMEX: [3][47] D13;
fragment DINERS: '30'[0-5] D11 | [3][68] D12 | MASTERCARD;
//fragment DINERS: [3] ([0][0-5]|[68]DIGIT) D11 | MASTERCARD;
fragment DISCOVER: '6011' D12 | '65' D14;
fragment JCB: ('2131' | '1800') D11 | '35' D14;

fragment CC: (VISA|MASTERCARD|AMEX|DINERS|DISCOVER|JCB);

fragment CCKEY: QUOTE 'CREDITCARD' QUOTE COLON;
CCTOKEN: CCKEY SPACE* QUOTE CC QUOTE ','? {errors.printErrors(); System.out.println("CREDITCARD: " + getText());};

/*********************************/
/*             CUSTOM            */
/*********************************/
fragment TAGCHAR1: [A-Za-z_];
fragment TAGCHARNOT1: [A-Za-z0-9-_.];

fragment TAG1NOTX: [A-WYZa-wyz_];
fragment TAG2NOTM: [A-LN-Za-ln-z0-9-_.];
fragment TAG3NOTL: [A-KM-Za-km-z0-9-_.];
fragment TAGNAME: ((((TAG1NOTX) | (TAGCHAR1 TAG2NOTM) | (TAGCHAR1 TAGCHARNOT1 TAG3NOTL)) TAGCHARNOT1*) | (TAGCHAR1 TAGCHARNOT1?));

fragment CONTENTCHAR: [A-Za-z0-9-_~!$&'()*+,;=: ];

fragment CUSTOMKEY: QUOTE TAGNAME QUOTE COLON;
CUSTOMTOKEN: CUSTOMKEY SPACE* QUOTE CONTENTCHAR* QUOTE','?  {errors.printErrors(); System.out.println("Element: "+getText());};


/*********************************/
/*            NO MATCH           */
/*********************************/


fragment STARTBRACKET: '{';
fragment ENDBRACKET: '}';
OBJEND: (STARTBRACKET | ENDBRACKET) {skip();};

END: .?EOF {errors.printErrors();};
fragment SPACE: [ \t]; //space or tab
NL: [\r\n] {skip();};
ERROR: . {errors.add(getText());};
