console.log("Hello, World!");

const SEQUENCE_LENGTH = 5;

// TODO: Use loops to create a site that will randomly generate a number sequence
// where one of the numbers is blanked out. Allow the user to put the missing number in.

var question_number = 0;
var questions_right = 0;
var questions_wrong = 0;
var number_sequence = "";
var answer = null;
var answer_checked = false;

function reset(){
    console.log("Reseting...");

    question_number = 0;
    questions_right = 0;
    questions_wrong = 0;
    number_sequence = "";
    answer = null;
    answer_checked = false;
    displayQuestionNumber(question_number);
    displaySequence();
    displayRight()
    displayWrong();
    clearCorrectnessContainer();
    displayPercentage();
}



function displayQuestionNumber(number) {
    document.querySelector('#question_number').textContent = number;
}

function displaySequence() {
    document.querySelector('#sequence').textContent = number_sequence;
}

function displayCorrect() {
    document.querySelector('#correct').textContent = "Correct!";
    document.querySelector('#incorrect').textContent = "";
}

function displayIncorrect() {
    document.querySelector('#incorrect').textContent = "Incorrect. The answer was " + answer;
    document.querySelector('#correct').textContent = "";
}

function displayRight() {
    document.querySelector('#right').textContent = questions_right;
}

function displayWrong() {
    document.querySelector('#wrong').textContent = questions_wrong;
}

function displayPercentage() {
    var percentage = "";
    if(questions_right == 0 || questions_wrong+questions_right == 0){
        percentage = "0";
    }
    else {
        percentage = 100*(questions_right/(questions_wrong+questions_right));
    }
    percentage += " %";
    document.querySelector('#percentage').textContent = percentage;
}

function clearCorrectnessContainer() {
    document.querySelector('#correct').textContent = "";
    document.querySelector('#incorrect').textContent = "";
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

    clearCorrectnessContainer();

    question_number++;
    answer_checked = false;
    displayQuestionNumber(question_number);

    // Generate a string of numbers using a random pattern
    // Generate a string of 5 numbers
    // Space each by a random number
    // Use a variation of + - / * to mix things up

    var starting_number = getRandomInt(1,100);
    var number = starting_number;

    // For now, only do + and -
    var operator = getRandomInt(0,2);
    var starting_operating_number = getRandomInt(1,100);
    var operating_number = starting_operating_number;
    console.log("operating_number");
    console.log(operating_number);


    // Make it so the increase is not linear sometimes
    var using_multiplier = getRandomInt(0,2);
    var starting_multiplier = getRandomInt(2,4);
    var multiplier = starting_multiplier;
    if(using_multiplier){
        console.log("Using multiplier:");
        console.log(multiplier);
    }

    // clear number sequence
    number_sequence = "";

    // Choose the digit to blank out
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
                number += operating_number;
                break;
            case 1:
                number -= operating_number;
                break;
            // case 2:
            //     number *= operating_number;
            //     break;
            // case 3:
            //     number /= operating_number;
            //     break;
            default:
                break;
        }


        if(using_multiplier){
            operating_number *= multiplier;
        }
    }

    console.log("Number Sequence: ");
    console.log(number_sequence);

    console.log("Answer:");
    console.log(answer);

    displaySequence()
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
    var user_answer = document.querySelector('#answer_input').value;
    if(answer == null || user_answer == ""){
        return;
    }
    if(answer_checked == true){
        return;
    }
    answer_checked = true;

    console.log("Checking answer...");

    // If response was right, increment right
    console.log("user_answer: ");
    console.log(user_answer);
    // If response was wrong, display the right answer and increment wrong
    if(answer == user_answer){
        console.log("Correct!");
        displayCorrect();
        questions_right++;

    }
    else {
        console.log("incorrect. The answer is " + answer);
        displayIncorrect();
        questions_wrong++;
    }

    displayRight();
    displayWrong();
    displayPercentage();
}
