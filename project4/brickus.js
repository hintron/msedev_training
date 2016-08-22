document.addEventListener("DOMContentLoaded", function(event) {

    // Create a gameboard that will store the pieces or just blocks
    // It needs to be a 20x20 board
    // It needs to know which piece belongs to who
    // gameboard[20][20];

    // r is keycode 82
    const R_KEY = 82;

    // const MAX_WIDTH = ;
    const MAX_HEIGHT = 600;
    const TILE_WIDTH = 30;
    const TILE_HEIGHT = TILE_WIDTH;

    // If not null, then it means it is grabbed and should move around
    var grabbed_piece = null;
    var grabbed_x = null;
    var grabbed_y = null;

    //
    //// Attach event handlers
    //
    // See this for setting event handlers: http://stackoverflow.com/a/6348597

    // Set an event listener for the r button, to rotate a piece
    window.addEventListener("keyup", function(event) {
        // See if keyup is ENTER
        if (event.keyCode == R_KEY) {
            rotate_piece();
        }
    });


    document.getElementById("rotate_btn").addEventListener("click", rotate_piece);
    // Set an event listener for the r button, to rotate a piece
    window.addEventListener("keyup", function(event) {
        // See if keyup is ENTER
        if (event.keyCode == R_KEY) {
            rotate_piece();
        }
    });
    // document.getElementById("new-problem-btn").addEventListener("click", newProblem);
    // document.getElementById("reset-btn").addEventListener("click", reset);


    // See http://stackoverflow.com/a/6802970 for moving html elements

    var pieces = document.getElementsByClassName("piece");

    for (var i = pieces.length - 1; i >= 0; i--) {
        pieces[i].addEventListener("mousedown", function(mouse_event) {
            // TODO: Have a check to make sure that players can only select
            // their own pieces and pieces that aren't already laid down

            var rect = mouse_event.srcElement.getBoundingClientRect();
            grabbed_piece = mouse_event.srcElement;

            var piece_x = rect.left;
            var piece_y = rect.top;

            var mouse_x = mouse_event.clientX;
            var mouse_y = mouse_event.clientY;

            grabbed_piece.style.zIndex = "1";

            // The grabbed location relative to the piece will be mouse_x - piece_x

            // Save the location of mouse within the piece
            grabbed_x = mouse_x - piece_x;
            grabbed_y = mouse_y - piece_y;
        });
    }


    window.addEventListener("mousemove", function(mouse_event) {
        if(grabbed_piece){
            // Don't move the piece if it goes out of the screen
            var x = mouse_event.clientX;
            var y = mouse_event.clientY;
            if(x < 0 || y < 0 || y > MAX_HEIGHT-(TILE_HEIGHT-grabbed_y) || y < grabbed_y){
                return;
            }
            // console.log("x: " + mouse_event.clientX);
            // console.log("y: " + mouse_event.clientY);

            // .tile needs to be set to absolute for this to work
            grabbed_piece.style.left = (x - grabbed_x) + "px";
            grabbed_piece.style.top = (y - grabbed_y) + "px";

            // TODO: If the cursor goes off-screen (negative or farther than viewport/document),
            // force the piece to be dropped (z will be reset, piece is no longer the grabbed piece)
            // TODO: Create a "drop piece" function so that it can be forced programmatically
        }
    });

    // TODO: Make sure the currently grabbed piece has the highest z value
    window.addEventListener("mouseup", function(mouse_event) {
        if(!grabbed_piece) {
            // ignore if no piece is grabbed
            return;
        }

        var piece = mouse_event.srcElement;
        console.log(piece);
        var rect = grabbed_piece.getBoundingClientRect();
        grabbed_piece = mouse_event.srcElement;


        var piece_x = rect.left;
        var piece_y = rect.top;

        // Locate the grid cell underneath the grabbed piece
        // look for the grid piece under the top left corner
        // To do this, quickly hide the grabbed piece and see what's underneath, then unhide it!
        piece.style.visibility = "hidden";
        var grid_cell = document.elementFromPoint(piece_x, piece_y);
        piece.style.visibility = "";

        // Check to make sure the piece is a grid piece
        if(hasClass(grid_cell, "gameboard-cell")){
            // TODO: Check to make sure the piece fits in the spot

            // If the piece is within that grid, snap it to the grid location
            var grid_cell_rect = grid_cell.getBoundingClientRect();
            // piece css needs to be set to absolute for this to work
            // Make sure to factor in the 1 px border
            piece.style.left = (grid_cell_rect.left+1) + "px";
            piece.style.top = (grid_cell_rect.top+1) + "px";
        }
        else {
            // Return piece to toolbar?
        }
        grabbed_piece.style.zIndex = "0";
        grabbed_piece = null;
        grabbed_x = null;
        grabbed_y = null;
    });



    // How to clone HTML objects:
    // http://stackoverflow.com/a/921316
    // Also https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode


});

//
//// Helper functions:
//

// Rotate the currently selected piece
function rotate_piece() {
    console.log("Rotate piece");
}

// See http://stackoverflow.com/a/5898748
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

