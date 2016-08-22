document.addEventListener("DOMContentLoaded", function(event) {

    // TODO: Create a gameboard that will store the pieces or just blocks
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

    console.log("attaching event handlers!!!");

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

    var tiles = document.getElementsByClassName("tile");

    console.log(tiles);

    for (var i = tiles.length - 1; i >= 0; i--) {
        var tile = tiles[i];
        tile.addEventListener("mousedown", function(mouse_event) {
            var rect = tile.getBoundingClientRect();
            grabbed_piece = tile;

            var piece_x = rect.left;
            var piece_y = rect.top;

            var mouse_x = mouse_event.clientX;
            var mouse_y = mouse_event.clientY;

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
        }
    });

    window.addEventListener("mouseup", function(mouse_event) {
        console.log("Drop peice");
        grabbed_piece = null;
        grabbed_x = null;
        grabbed_y = null;
        // TODO: Snap to grid - Have it snap to the closest grid location
    });


    // Rotate the currently selected piece
    function rotate_piece() {
        console.log("Rotate piece");
    }

    // How to clone HTML objects:
    // http://stackoverflow.com/a/921316
    // Also https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode


});



