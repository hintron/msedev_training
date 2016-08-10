document.addEventListener("DOMContentLoaded", function(event) {

    // TODO: Create a gameboard that will store the pieces or just blocks
    // It needs to be a 20x20 board
    // It needs to know which piece belongs to who
    // gameboard[20][20];

    // r is keycode 82
    const R_KEY = 82;


    //
    // Attach event handlers
    //
    // See this for setting event handlers: http://stackoverflow.com/a/6348597

    console.log("attaching event handlers!!!");

    // Set an event listener for the r button, to rotate a piece
    window.addEventListener("keyup", function(event) {
        // See if keyup is ENTER
        if (event.keyCode == R_KEY) {
            rotate_piece();
        }
    });
    document.getElementById("rotate_btn").addEventListener("click", rotate_piece);
    // document.getElementById("new-problem-btn").addEventListener("click", newProblem);
    // document.getElementById("reset-btn").addEventListener("click", reset);

    // Rotate the currently selected piece
    function rotate_piece() {
        console.log("Rotate piece");
    }

});



