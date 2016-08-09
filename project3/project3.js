console.log("Hello, World!");

const SEQUENCE_LENGTH = 5;

// TODO: Use loops to create a site that will randomly generate a number sequence
// where one of the numbers is blanked out. Allow the user to put the missing number in.

var question_number = 0;
var questions_right = 0;
var questions_wrong = 0;
var precentage_right = 0;
var number_sequence = "";
var answer = null;


function reset(){
    console.log("Reseting...");

    question_number = 0;
    questions_right = 0;
    questions_wrong = 0;
    precentage_right = 0;
    number_sequence = "";
    answer = null;
    displayQuestionNumber(question_number);
    displaySequence(number_sequence);
}



function displayQuestionNumber(number) {
    document.querySelector('#question_number').textContent = number;
}

function displaySequence(text) {
    document.querySelector('#sequence').textContent = text;
}



// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function new_problem() {
    console.log("Creating new problem...");

    question_number++;
    displayQuestionNumber(question_number);

    // Generate a string of numbers using a random pattern
    // Generate a string of 5 numbers
    // Space each by a random number
    // Use a variation of + - / * to mix things up

    var starting_number = getRandomInt(1,100);
    var number = starting_number;
    // For now, only do + and -
    var operator = getRandomInt(0,2);
    var starting_multiplier = getRandomInt(0,3);
    var multiplier = starting_multiplier;
    var starting_operating_number = getRandomInt(1,100);

    number_sequence = "";


    var omitted_number_index = getRandomInt(1,SEQUENCE_LENGTH);



    for (var i = 0; i < SEQUENCE_LENGTH; i++) {
        if(i == omitted_number_index){
            console.log("Index to omit: ");
            console.log(omitted_number_index);
            number_sequence += "_";
            answer = number;
        }
        else {
            number_sequence += number;
        }
        number_sequence += " ";

        switch(operator){
            case 0:
                number += starting_operating_number;
                break;
            case 1:
                number -= starting_operating_number;
                break;
            case 2:
                number *= starting_operating_number;
                break;
            case 3:
                number /= starting_operating_number;
                break;
            default:
                break;
        }
        // TODO: Instead, make this also a random operation?
        // multiplier *= multiplier;
    }

    console.log("Number Sequence: ");
    console.log(number_sequence);

    console.log("Answer:");
    console.log(answer);

    displaySequence(number_sequence)

    return number_sequence;
}


// Enable the user to hit enter instead of having to click a button with a mouse
// See http://stackoverflow.com/a/155263
// document.getElementById("id_of_textbox").addEventListener("keyup", function(event) {
//     // Prevent form submission in a form
//     event.preventDefault();
//     // See if keyup is ENTER
//     if (event.keyCode == 13) {
//         document.getElementById("id_of_button").click();
//     }
// });





// TODO: Check to see if the number is correct and keep track of the number of correct and incorrect
function check_answer() {
    console.log("Checking answer...");
}
