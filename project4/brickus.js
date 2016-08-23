
document.addEventListener("DOMContentLoaded", function(event) {

    // Create a gameboard that will store the pieces or just blocks
    // It needs to be a 20x20 board
    // It needs to know which piece belongs to who

    // r is keycode 82
    const R_KEY = 82;

    // const MAX_WIDTH = ;
    const MAX_HEIGHT = 600;
    const TILE_WIDTH = 30;
    const TILE_HEIGHT = TILE_WIDTH;

    const GAMEBOARD_WIDTH = 12;

    // If not null, then it means it is grabbed and should move around
    var grabbed_piece = null;
    var grabbed_x = null;
    var grabbed_y = null;


    var current_player = 3;

    var player1_score = 0;
    var player2_score = 0;
    var player3_score = 0;
    var player4_score = 0;
    var free_spaces = GAMEBOARD_WIDTH * GAMEBOARD_WIDTH;


    // Each entry will hold a number for each player, 1 - 4
    // null means it is free
    // [row][column]
    // See http://stackoverflow.com/a/966239
    var gameboard = new Array(GAMEBOARD_WIDTH);
    for (var i = 0; i < GAMEBOARD_WIDTH; i++) {
        gameboard[i] = new Array(GAMEBOARD_WIDTH);
    }

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

    // See http://stackoverflow.com/a/6802970 for moving html elements

    var pieces = document.getElementsByClassName("piece");
    for (var i = pieces.length - 1; i >= 0; i--) {
        pieces[i].addEventListener("mousedown", function(mouse_event) {
            // TODO: Have a check to make sure that players can only select
            // their own pieces and pieces that aren't already laid down
            var rect = mouse_event.currentTarget.getBoundingClientRect();
            grabbed_piece = mouse_event.currentTarget;

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

        var rect = grabbed_piece.getBoundingClientRect();
        var piece_x = rect.left;
        var piece_y = rect.top;

        // Locate the grid cell underneath the grabbed piece
        // look for the grid piece under the top left corner
        // To do this, quickly hide the grabbed piece and see what's underneath, then unhide it!
        grabbed_piece.style.visibility = "hidden";
        var grid_cell = document.elementFromPoint(piece_x, piece_y);

        // console.log(grid_cell);
        // Let pieces snap to the grid if the underlying tile of a piece is an invisible piece,
        // but make sure to grab the underlying grid cell
        var temp;
        if(has_class(grid_cell, "piece")){

            do {
                grid_cell.style.visibility = "hidden";
                temp = document.elementFromPoint(piece_x, piece_y);
                grid_cell.style.visibility = "";
                grid_cell = temp;
            }
            while (grid_cell && !has_class(grid_cell, "gameboard-cell"));

        }

        grabbed_piece.style.visibility = "";




        // Check to make sure the element under the piece is a grid cell
        if(has_class(grid_cell, "gameboard-cell")){
            // Figure out what index the grid_cell is at
            var grid_cell_col = grid_cell.dataset.column;
            var grid_cell_row = grid_cell.parentElement.dataset.row;

            console.log("grid_cell_col");
            console.log(grid_cell_col);
            console.log("grid_cell_row");
            console.log(grid_cell_row);


            // TODO: Check to make sure the piece fits in the spot

            // If the piece is within that grid, snap it to the grid location
            var grid_cell_rect = grid_cell.getBoundingClientRect();
            // piece css needs to be set to absolute for this to work
            // Make sure to factor in the 1 px border
            grabbed_piece.style.left = (grid_cell_rect.left+1) + "px";
            grabbed_piece.style.top = (grid_cell_rect.top+1) + "px";

            // TODO: Set the gameboard to register the pieces

            // Read the data-* html attributes for info on the pieces
            var bitmap = grabbed_piece.dataset.bitmap;
            var width = grabbed_piece.dataset.width;
            var player = grabbed_piece.dataset.player;
            console.log("bitmap");
            console.log(bitmap);
            console.log("width");
            console.log(width);
            console.log("player");
            console.log(player);


            // TODO: Set the gameboard pieces to the player

            // for (var i = 0; i < width; i++) {
            //     for (var j = 0; j < width; j++) {
            //         console.log(bitmap);
            //         console.log(gameboard);
            //         if(+bitmap[i*width+j]){
            //             gameboard[i][j];
            //         };
            //         console.log(gameboard);
            //     }
            // }

            // calculate_points();


        }
        else {
            // Return piece to toolbar?
        }


        // Reset the z index
        grabbed_piece.style.zIndex = "0";
        grabbed_piece = null;
        grabbed_x = null;
        grabbed_y = null;
    });


    function calculate_points() {
        free_spaces = GAMEBOARD_WIDTH*GAMEBOARD_WIDTH;

        player1_score = 0;
        player2_score = 0;
        player3_score = 0;
        player4_score = 0;

        // TODO: Update the point totals for all players
        for (var i = 0; i < GAMEBOARD_WIDTH; i++) {
            for (var j = 0; j < GAMEBOARD_WIDTH; j++) {
                switch(gameboard[i][j]){
                    case 0:
                    case null:
                        free_spaces--;
                        break;
                    case 1:
                        player1_score++;
                        break;
                    case 2:
                        player2_score++;
                        break;
                    case 3:
                        player3_score++;
                        break;
                    case 4:
                        player4_score++;
                        break;
                    default:
                        console.log("Unknown gameboard point!");
                        break;
                }
            }
        }

        console.log("Player Scores:");
        console.log("free_spaces");
        console.log(free_spaces);
        console.log("player1_score");
        console.log(player1_score);
        console.log("player2_score");
        console.log(player2_score);
        console.log("player3_score");
        console.log(player3_score);
        console.log("player4_score");
        console.log(player4_score);
    }

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
function has_class(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


// TODO: Create a reset game function

// NOTE: This isn't needed, since I saved the piece to a global var
// // Get the containing "piece" element
// function get_ancestor_piece(el) {
//     var parent = el.parentElement;
//     while(parent && !has_class(parent, "piece")){
//         console.log("Iteration!");
//         parent = parent.parentElement;
//     }
//     if(!parent) {
//         console.log("Could not find ancestor with class \".piece\"!");
//     }
//     return parent;
// }
