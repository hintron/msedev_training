
document.addEventListener("DOMContentLoaded", function(event) {

    document.getElementById("check-answer-btn").addEventListener("click", generate_lucky_number);

    generate_lut();
    generate_flags();


});


function generate_lucky_number() {
    console.log("Generating Lucky Number...");


    var user_answer = document.querySelector('#user_input').value;

    if(user_answer == null){
        return;
    }

    console.log("Checking answer " + user_answer);


}


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
        // console.log("i: " + i);
        num = 1 << i;
        masks.push(num);
        // console.log("num: " + num);
    }
}


function generate_lut() {
    var str = "";

    var digits = 1;
    // start at 0th digit
    var digit = 0;

    var all_sevens = false;



    for (var i = 0; i < iterations; i++) {
        for(var j = 0; j < digits){
            str = "";
            // Convert string to number
            lut[i] = ~~str;
            if(all_sevens){
                digits++;
                all_sevens = false;
            }
        }
    }

}
