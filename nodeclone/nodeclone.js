console.log("nodeclone");

//
//// Attach event handlers and initialize code
//
document.addEventListener("DOMContentLoaded", function(event) {

    var test2 = document.getElementById("test2");

    console.log();

    // console.log("nodeclone: " + mouse_event.clientX);
    // // Set an event listener for the r button, to rotate a piece
    // window.addEventListener("keyup", function(event) {
    //     // See if keyup is ENTER
    //     if (event.keyCode == R_KEY) {
    //         rotate_piece();
    //     }
    // });

    // // See http://stackoverflow.com/a/6802970 for moving html elements
    // var pieces = document.getElementsByClassName("piece");
    // for (var i = pieces.length - 1; i >= 0; i--) {
    //     pieces[i].addEventListener("mousedown", mousedown_handler);
    //     // Set all pieces to absolute positioning now that they are rendered
    //     // Get bounding rect
    //     // See http://stackoverflow.com/a/11396681
    //     var rect = pieces[i].getBoundingClientRect();
    //     pieces[i].style.position = "absolute";
    //     // Reset the coordinates to where it was, since setting to absolute move the piece
    //     pieces[i].style.left = rect.left + "px";
    //     pieces[i].style.top = rect.top + "px";
    // }
    // window.addEventListener("mousemove", mousemove_handler);
    // window.addEventListener("mouseup", mouseup_handler);

});