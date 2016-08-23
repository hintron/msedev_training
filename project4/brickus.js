
//
//// Attach event handlers
//
document.addEventListener("DOMContentLoaded", function(event) {
    // See this for setting event handlers: http://stackoverflow.com/a/6348597

    // Set an event listener for the r button, to rotate a piece
    window.addEventListener("keyup", function(event) {
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
        pieces[i].addEventListener("mousedown", mousedown_handler);
    }
    window.addEventListener("mousemove", mousemove_handler);
    window.addEventListener("mouseup", mouseup_handler);
});




// r is keycode 82
const R_KEY = 82;
const MAX_HEIGHT = 700;
const GAMEBOARD_WIDTH = 12;

// If not null, then it means it is grabbed and should move around
var grabbed_piece = null;
// These are the coordinates relative to the upper-left corner of the grabbed piece
var grabbed_x = null;
var grabbed_y = null;

// var current_player = 3;

// Create a gameboard that will store the pieces or just blocks
// It needs to be a 20x20 board
// It needs to know which piece belongs to who
// Each entry will hold a number for each player, 1 - 4
// null means it is free
// [row][column]
// See http://stackoverflow.com/a/966239
var gameboard = new Array(GAMEBOARD_WIDTH);
for (var i = 0; i < GAMEBOARD_WIDTH; i++) {
    gameboard[i] = new Array(GAMEBOARD_WIDTH);
}



function mousedown_handler(mouse_event) {
    // TODO: Have a check to make sure that players can only select
    // their own pieces and pieces that aren't already laid down


    var rect = mouse_event.currentTarget.getBoundingClientRect();
    grabbed_piece = mouse_event.currentTarget;


    // TODO: Erase the points on the gameboard if the piece is picked up off the gameboard

    // "free" the pieces from the toolbar by setting them to absolute
    // Also, set it to block display, so it doesn't fall up
    grabbed_piece.style.position = "absolute";
    grabbed_piece.style.display = "block";

    var piece_x = rect.left;
    var piece_y = rect.top;

    var mouse_x = mouse_event.clientX;
    var mouse_y = mouse_event.clientY;

    // Make sure the currently grabbed piece has the highest z value
    grabbed_piece.style.zIndex = "1";

    // The grabbed location relative to the piece will be mouse_x - piece_x

    // Save the location of mouse within the piece
    grabbed_x = mouse_x - piece_x;
    grabbed_y = mouse_y - piece_y;
}

function mousemove_handler(mouse_event) {
    if(grabbed_piece){
        // Don't move the piece if it goes out of the screen
        var x = mouse_event.clientX;
        var y = mouse_event.clientY;
        // TODO: Why are pieces freezing game when hit bottom?
        if(x < 0 || y < 0 || y > MAX_HEIGHT-grabbed_y || y < grabbed_y){
            drop_piece();
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
}

function mouseup_handler(mouse_event) {
    if(!grabbed_piece) {
        // ignore if no piece is grabbed
        return;
    }

    //
    //// Check to make sure the element under the piece is a grid cell
    //
    var gameboard_cell = get_underlying_gameboard_cell(grabbed_piece);
    if(gameboard_cell == null) {
        // Piece was not dropped on the gameboard, so drop the piece
        console.log("Piece was not dropped on the gameboard");
        drop_piece();
        return;
    }

    // Figure out what index the gameboard_cell is at
    var gameboard_cell_col = +gameboard_cell.dataset.column;
    var gameboard_cell_row = +gameboard_cell.parentElement.dataset.row;

    // console.log("gameboard_cell_col: " + gameboard_cell_col);
    // console.log("gameboard_cell_row: " + gameboard_cell_row);

    // Read the data-* html attributes for info on the pieces
    var bitmap = grabbed_piece.dataset.bitmap;
    var cols = +grabbed_piece.dataset.cols;
    var rows = +grabbed_piece.dataset.rows;
    var player = +grabbed_piece.dataset.player;


    // Check to make sure the data embedded in the html makes sense
    if(rows*cols != bitmap.length){
        console.log("Bitmap length does not match the rows and cols specified in the data properties!!");
        console.log("rows: " + rows);
        console.log("cols: " + cols);
        console.log("bitmap.length: " + bitmap.length);
        drop_piece();
        return;
    }

    // Check to make sure the piece fits on the gameboard
    if(gameboard_cell_col + cols-1 >= GAMEBOARD_WIDTH || gameboard_cell_row + rows-1 >= GAMEBOARD_WIDTH){
        console.log("Piece does not fit on the gameboard!");
        drop_piece();
        return;
    }

    // TODO:
    // // Check to make sure the piece is not going over other pieces
    // // TODO: Break this into its own function?
    // for (i = gameboard_cell_row; i < gameboard_cell_row+rows; i++) {
    //     for (j = gameboard_cell_col; j < gameboard_cell_col+cols; j++) {
    //         // Grab the char at the string
    //         bit = +bitmap.charAt((i-gameboard_cell_row)*rows+(j-gameboard_cell_col));
    //         if(bit && gameboard[i][j]){
    //             console.log("Can't place piece at that spot!");
    //             drop_piece();
    //             return;
    //         };
    //     }
    // }


    //
    //// Snap to gameboard grid!
    //

    // If the piece is within that grid, snap it to the grid location
    var gameboard_cell_rect = gameboard_cell.getBoundingClientRect();
    // piece css needs to be set to absolute for this to work
    // Make sure to factor in the 1 px border
    grabbed_piece.style.left = (gameboard_cell_rect.left+1) + "px";
    grabbed_piece.style.top = (gameboard_cell_rect.top+1) + "px";


    // Set the gameboard to register the pieces for the player
    // Start at the location of the upper left corner of the piece,
    // and iterate through the bitmap to set the gameboard
    // TODO: Break this out into a function
    for (i = gameboard_cell_row; i < gameboard_cell_row+rows; i++) {
        for (j = gameboard_cell_col; j < gameboard_cell_col+cols; j++) {
            // Grab the char at the string
            bit = +bitmap.charAt((i-gameboard_cell_row)*rows+(j-gameboard_cell_col));
            if(bit){
                gameboard[i][j] = player;
            };
        }
    }
    // console.log(gameboard);

    calculate_points();
    drop_piece();
}

/**
    Returns the underlying gameboard_cell from the passed element, or null if it isn't under it

**/
function get_underlying_gameboard_cell(element) {
    var rect = element.getBoundingClientRect();
    var piece_x = rect.left;
    var piece_y = rect.top;

    // Locate the grid cell underneath the grabbed piece
    // look for the grid piece under the top left corner
    // To do this, quickly hide the grabbed piece and see what's underneath, then unhide it!
    element.style.visibility = "hidden";
    var gameboard_cell = document.elementFromPoint(piece_x, piece_y);

    // Let pieces snap to the grid if the underlying tile of a piece is an invisible piece,
    // but make sure to grab the underlying grid cell
    var i,j,bit,temp;
    var hidden_stack = new Array();

    // Keep digging until either a gameboard cell is found or the document body
    // See http://stackoverflow.com/a/9488090
    while (document.body !== gameboard_cell && !has_class(gameboard_cell, "gameboard-cell")){
        hidden_stack.push(gameboard_cell);
        gameboard_cell.style.visibility = "hidden";
        temp = document.elementFromPoint(piece_x, piece_y);
        gameboard_cell = temp;
    }

    // Unhide everything that was hidden
    for (var i = hidden_stack.length - 1; i >= 0; i--) {
        temp = hidden_stack.pop();
        temp.style.visibility = "";
    }
    element.style.visibility = "";

    if(document.body === gameboard_cell) {
        return null;
    }
    else {
        return gameboard_cell;
    }
}


function drop_piece() {
    // Reset the z index
    grabbed_piece.style.zIndex = "0";
    grabbed_piece = null;
    grabbed_x = null;
    grabbed_y = null;
}

function calculate_points() {
    var free_spaces = 0;
    var player1_score = 0;
    var player2_score = 0;
    var player3_score = 0;
    var player4_score = 0;

    // TODO: Update the point totals for all players
    for (var i = 0; i < GAMEBOARD_WIDTH; i++) {
        for (var j = 0; j < GAMEBOARD_WIDTH; j++) {
            switch(gameboard[i][j]){
                case 0:
                case null:
                case undefined:
                    free_spaces++;
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

    // console.log("free_spaces: " + free_spaces);
    document.getElementById("player1_score").textContent = player1_score;
    document.getElementById("player2_score").textContent = player2_score;
    document.getElementById("player3_score").textContent = player3_score;
    document.getElementById("player4_score").textContent = player4_score;
}


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


// How to clone HTML objects:
// http://stackoverflow.com/a/921316
// Also https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
