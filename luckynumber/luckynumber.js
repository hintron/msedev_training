//
//// Display Code
//

document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector("#generate-btn").addEventListener("click", output_lucky_number);
    console.log("Gerenating LUT...");
    generate_masks();
    generate_lut();
});


function output_lucky_number() {
    console.log("Generating Lucky Number...");
    var user_input = document.querySelector('#user_input').value;

    console.log("user_input: ");
    console.log(user_input);

    // Make sure input isn't null
    if(user_input == ""){
        document.querySelector('#lucky_number').textContent = "Input was null...";
        return;
    }

    // convert input into a number
    user_input = +user_input;

    if(!Number.isInteger(user_input)){
        document.querySelector('#lucky_number').textContent = "Input was not an integer...";
        return;
    }

    // Bitwise operators only can work on 32 bit numbers
    // So make sure input can fit into a 32 bit 2's compliment number
    // -(2^n-1) to (2^n-1)-1 (-2147483648 to +2147483647)
    // Note: (1<<31)-1 doesn't produce the result I want...
    // console.log("Max input value: " + 2147483647);
    // The next number after 777,777,777 is 4,444,444,444, which isn't representable as a 32-bit number

    // Bounds checking
    if(user_input > 777777777) {
        document.querySelector('#lucky_number').textContent = "Input was too big. Must be a 32-bit 2's compliment number";
        return;
    }


    // Calculate the lucky number
    console.log("Calculating lucky number: " + user_input);
    lucky_number = get_lucky_number(user_input);

    // Output the lucky number
    if(lucky_number){
        document.querySelector('#lucky_number').textContent = lucky_number;
    }
    else {
        document.querySelector('#lucky_number').textContent = "Could not find the lucky number...";
    }
}


//
//// Lucky Number code
//

// Max representable number is 777777777, which is 9 digits
const MAX_DIGITS = 9;
var lut = [];
var masks = [];

function generate_masks() {
    var i;
    var num;
    // Create one-hot encoding masks for each digit
    for (i = 0; i < MAX_DIGITS; i++) {
        num = 1 << i;
        masks.push(num);
        // console.log("i: " + i);
        // console.log("num: " + num);
    }
}

function generate_lut() {
    var digit_number;
    var generate_count; // The amount of numbers to generate for each digit
    var i, j, k;
    var str;
    var strArray;

    for (digit_number = 1; digit_number <= MAX_DIGITS; digit_number++) {
        // console.log("Digit " + (digit_number));
        generate_count = 1 << (digit_number);

        for (i = 0; i < generate_count; i++) {
            // console.log("i: " + i);
            strArray = [];
            // For each bit in i, if it is a 0, create a 4 digit,
            // and if it is 1, give it a 7 digit.
            // e.g. for digit_number == 2,
            // i = 0 -> 00 == 44
            // i = 1 -> 01 == 47
            // i = 2 -> 10 == 74
            // i = 3 -> 11 == 77

            for(j = 0; j < digit_number; j++){
                // console.log("Masks[" + j + "]: " + masks[j]);
                strArray[j] = ((masks[j] & i)) ? "7" : "4";
            }

            // Concatenate all the digits into a single string to store
            str = "";
            for (k = strArray.length-1; k >= 0; k--) {
                str += strArray[k];
            }

            // console.log("output: " + str);
            // Convert the string to number
            // See http://stackoverflow.com/questions/12862624/whats-the-fastest-way-to-convert-string-to-number-in-javascript
            lut.push(~~str);
            // This also works
            // lut.push(+str);
        }
    }

    console.log("lut: ");
    console.log(lut);
}

// TODO: Make a more efficient way of searching through all the lucky numbers
// Binary search? Count the digits of the input, and start at 2^digit#?
function get_lucky_number(input){
    var i;
    for (i = 0; i < lut.length; i++) {
        if(input <= lut[i]){
            return lut[i];
        }
    }
}


// Notes:
// All numbers in javascript are 64-bit floats by default.
// However, when using bitwise operators, the number is converted to 32-bit 2's complement
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Flags_and_bitmasks
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
// http://stackoverflow.com/questions/596467/how-do-i-convert-a-float-number-to-a-whole-number-in-javascript

// Javascript strings are immutable. There is no character replacement. The best you can
// do is to create a new string. See http://stackoverflow.com/a/1431113
