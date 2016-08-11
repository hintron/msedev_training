// "use strict";

document.addEventListener("DOMContentLoaded", function(event) {

    document.getElementById("check-answer-btn").addEventListener("click", generate_lucky_number);

    generate_flags();
    generate_lut();


});


function generate_lucky_number() {
    console.log("Generating Lucky Number...");


    var user_answer = document.querySelector('#user_input').value;

    if(user_answer == null){
        return;
    }

    console.log("Checking answer " + user_answer);


}


// Notes:
// All numbers in javascript are 64-bit floats by default.
// However, when using bitwise operators, the number is converted to 32-bit 2's complement
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Flags_and_bitmasks
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
// http://stackoverflow.com/questions/596467/how-do-i-convert-a-float-number-to-a-whole-number-in-javascript

// Javascript strings are immutable. There is no character replacement. The best you can
// do is to create a new string. See http://stackoverflow.com/a/1431113


const MAX_DIGITS = 7;



var lut = [];

function generate_lucky_number_using_lut() {
}


// Generate one-hot encoding masks
var masks = [];
function generate_flags() {
    var i;
    var num;
    console.log("MAX_DIGITS: " + MAX_DIGITS);
    // Create one-hot encoding for each digit
    for (i = 0; i < MAX_DIGITS; i++) {
        num = 1 << i;
        masks.push(num);
        // console.log("i: " + i);
        console.log("num: " + num);
    }

}



function generate_lut() {
    // TODO: Loop through MAX_DIGITS digits!
    var digits = 2;
    var num = 1 << digits;
    var i, j, k;
    var str;
    var strArray;

    for (i = 0; i < num; i++) {
        console.log("i: " + i);
        strArray = [];
        // For each bit in i, if it is a 0, create a 4 digits,
        // and if it is 1, give it a 7 digit.
        // e.g.
        // i = 0 -> 00 == 44
        // i = 1 -> 01 == 47
        // i = 2 -> 10 == 74
        // i = 3 -> 11 == 77

        for(j = 0; j < digits; j++){
            console.log("Masks[" + j + "]: " + masks[j]);
            strArray[j] = ((masks[j] & i)) ? "7" : "4";
        }

        // Contatenate all the digits into a single string to store
        str = "";
        for (k = strArray.length-1; k >= 0; k--) {
            str += strArray[k];
        }

        console.log("output: " + str);
        // Convert the string to number
        // See http://stackoverflow.com/questions/12862624/whats-the-fastest-way-to-convert-string-to-number-in-javascript
        lut[i] = ~~str;
        // This also works
        // lut[i] = +str;
    }


    console.log("lut: ");
    console.log(lut);
}
