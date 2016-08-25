/*
    Future Improvements:
    * Create more pieces so that the game is more balanced
    * Create player turns and a "turn done" button so that players can't
        move different player's pieces accidentally
    * Make scrolling not mess up piece movement and placement
    * Build up the infrastructure so that the players can rotate pieces

*/

//
//// Attach event handlers and initialize code
//
document.addEventListener("DOMContentLoaded", function(event) {
    // See this for setting event handlers: http://stackoverflow.com/a/6348597

    // Set an event listener for the r button, to rotate a piece
    window.addEventListener("keyup", function(event) {
        if (event.keyCode == R_KEY) {
            rotate_piece();
        }
    });

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
        // Set all pieces to absolute positioning now that they are rendered
        // Get bounding rect
        // See http://stackoverflow.com/a/11396681
        var rect = pieces[i].getBoundingClientRect();
        pieces[i].style.position = "absolute";
        // Reset the coordinates to where it was, since setting to absolute move the piece
        pieces[i].style.left = rect.left + "px";
        pieces[i].style.top = rect.top + "px";
    }
    window.addEventListener("mousemove", mousemove_handler);
    window.addEventListener("mouseup", mouseup_handler);

});

// r is keycode 82
const R_KEY = 82;
const MAX_HEIGHT = 700;
const GAMEBOARD_WIDTH = 12;
const GAMEBOARD_CELL_WIDTH = 30;
const GAMEBOARD_CELL_HALF_WIDTH = GAMEBOARD_CELL_WIDTH/2;
// The offset is to find the neighbors of the currently selected gameboard cell
const GAMEBOARD_CELL_OFFSET = GAMEBOARD_CELL_WIDTH + GAMEBOARD_CELL_HALF_WIDTH;

// If not null, then it means it is grabbed and should move around
var grabbed_piece = null;
// These are the coordinates of the grab location relative to the upper-left corner of the grabbed piece
var grab_relative_x = null;
var grab_relative_y = null;


// A monotonically increasing z value for every time a piece is touched.
// This will never realistically overflow with regular human use
var global_z_count = 1;


// Create a gameboard that will store the pieces or just blocks
// It needs to know which piece belongs to who
// Each entry will hold a number for each player, 1 - 4
// 0, undefined, or null means it is a free space
// [row][column]
// See http://stackoverflow.com/a/966239
var gameboard = new Array(GAMEBOARD_WIDTH);
for (var i = 0; i < GAMEBOARD_WIDTH; i++) {
    gameboard[i] = new Array(GAMEBOARD_WIDTH);
}


function mousedown_handler(mouse_event) {
    // NOTE: If the element that emitted the event is just a tile_row,
    // it means that an etile was underneath it. So ignore it.
    if(has_class(mouse_event.target, "tile_row")){
        // Check underneath the mouseclick to see if there is another draggable piece
        var returned_piece = get_underlying_draggable_piece(mouse_event.target, mouse_event.clientX, mouse_event.clientY);
        if(returned_piece){
            // console.log("Grabbing the piece under the top-most piece!");
            grabbed_piece = returned_piece;
        }
        else {
            // There was no draggable piece under the empty tile
            return;
        }
    }
    else {
        grabbed_piece = mouse_event.currentTarget;
    }

    // TODO: Have a check to make sure that players can only select their own pieces


    // Erase the points on the gameboard if the piece is picked up off the gameboard
    var gameboard_cell = get_underlying_gameboard_cell(grabbed_piece);
    if(gameboard_cell && grabbed_piece.brickus_placed){
        grabbed_piece.brickus_placed = false;

        // Figure out what index the gameboard_cell is at
        var gameboard_cell_col = +gameboard_cell.dataset.column;
        var gameboard_cell_row = +gameboard_cell.parentElement.dataset.row;

        // Read the data-* html attributes for info on the pieces
        var bitmap = grabbed_piece.dataset.bitmap;
        var cols = +grabbed_piece.dataset.cols;
        var rows = +grabbed_piece.dataset.rows;

        var i,j,bit,index;
        // Clear the gameboard of the points of the selected piece
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                // Grab the char at the string
                index = (i*cols)+j;
                bit = +bitmap.charAt(index);
                if(bit){
                    // Clear the piece
                    gameboard[i+gameboard_cell_row][j+gameboard_cell_col] = 0;
                };
            }
        }

        // Update the scoreboard
        calculate_points();
    }

    // Save the grab position relative to the piece
    var grabbed_piece_rect = grabbed_piece.getBoundingClientRect();
    var grabbed_piece_x = grabbed_piece_rect.left;
    var grabbed_piece_y = grabbed_piece_rect.top;

    // Save the location of mouse within the piece
    grab_relative_x = mouse_event.clientX - grabbed_piece_x;
    grab_relative_y = mouse_event.clientY - grabbed_piece_y;

    // Make sure the currently grabbed piece has the highest z value
    // With a monotonically increasing z number, the most recently
    // touched piece will be displayed on top
    grabbed_piece.style.zIndex = global_z_count;
    global_z_count++;
}

function mousemove_handler(mouse_event) {
    if(grabbed_piece){
        // Don't move the piece if it goes out of the screen

        var mouse_x = mouse_event.clientX;
        var mouse_y = mouse_event.clientY;

        // TODO: Why are pieces freezing the game when hit bottom?
        if(mouse_x < grab_relative_x || mouse_y < grab_relative_y /*|| mouse_y > MAX_HEIGHT-grab_relative_y*/){
            return;
        }

        // piece needs to be set to absolute for this to work
        grabbed_piece.style.left = (mouse_x - grab_relative_x) + "px";
        grabbed_piece.style.top = (mouse_y - grab_relative_y) + "px";
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
        drop_piece();
        return;
    }

    // Read the data-* html attributes for info on the pieces
    var bitmap = grabbed_piece.dataset.bitmap;
    var cols = +grabbed_piece.dataset.cols;
    var rows = +grabbed_piece.dataset.rows;
    var player = +grabbed_piece.dataset.player;


    // Check to make sure the data embedded in the html makes sense
    if(rows*cols != bitmap.length){
        alert("Bitmap length does not match the rows and cols specified in the data properties!!");
        console.log("rows: " + rows);
        console.log("cols: " + cols);
        console.log("bitmap.length: " + bitmap.length);
        drop_piece();
        return;
    }


    //
    //// Snap to gameboard grid!
    //
    // If the piece is within that grid, snap it to the grid location

    // To accommodate closest grid snapping, find all the adjacent grid cells and see which is closest
    // By default, it snaps to the upper left corner
    var upper_left_rect = gameboard_cell.getBoundingClientRect();
    var upper_left_x = upper_left_rect.left;
    var upper_left_y = upper_left_rect.top;

    var upper_right_corner_cell = get_underlying_gameboard_cell_by_point(upper_left_x + GAMEBOARD_CELL_OFFSET, upper_left_y);
    var lower_right_corner_cell = get_underlying_gameboard_cell_by_point(upper_left_x + GAMEBOARD_CELL_OFFSET, upper_left_y + GAMEBOARD_CELL_OFFSET);
    var lower_left_corner_cell = get_underlying_gameboard_cell_by_point(upper_left_x, upper_left_y + GAMEBOARD_CELL_OFFSET);

    // Find the closest grid cell to snap to, and set it to gameboard cell
    var grabbed_piece_rect = grabbed_piece.getBoundingClientRect();
    var grabbed_piece_x = grabbed_piece_rect.left;
    var grabbed_piece_y = grabbed_piece_rect.top;
    var x_breakpoint = upper_left_x + GAMEBOARD_CELL_HALF_WIDTH;
    var y_breakpoint = upper_left_y + GAMEBOARD_CELL_HALF_WIDTH;
    // If it snaps to something other than the upper left, change the gameboard_cell pointer
    if(upper_right_corner_cell && grabbed_piece_x > x_breakpoint && grabbed_piece_y <= y_breakpoint){
        gameboard_cell = upper_right_corner_cell;
    }
    else if(lower_right_corner_cell && grabbed_piece_x > x_breakpoint && grabbed_piece_y > y_breakpoint){
        gameboard_cell = lower_right_corner_cell;
    }
    else if(lower_left_corner_cell && grabbed_piece_x <= x_breakpoint && grabbed_piece_y > y_breakpoint){
        gameboard_cell = lower_left_corner_cell;
    }
    else {
        // Default - the gameboard will stay as the upper left cell and snap to upper left corner
    }

    // Figure out what index the gameboard_cell is at
    var gameboard_cell_col = +gameboard_cell.dataset.column;
    var gameboard_cell_row = +gameboard_cell.parentElement.dataset.row;

    // Check to make sure the piece fits on the gameboard
    if(gameboard_cell_col + cols-1 >= GAMEBOARD_WIDTH || gameboard_cell_row + rows-1 >= GAMEBOARD_WIDTH){
        console.log("Piece does not fit on the gameboard!");
        drop_piece();
        return;
    }

    var i,j,bit,index;
    // Check to make sure the piece is not going over other pieces
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            // Grab the char at the string
            index = (i*cols)+j;
            bit = +bitmap.charAt(index);
            if(bit && gameboard[i+gameboard_cell_row][j+gameboard_cell_col]){
                drop_piece();
                return;
            };
        }
    }

    var gameboard_cell_rect = gameboard_cell.getBoundingClientRect();
    // piece css needs to be set to absolute for this to work
    // Make sure to factor in the 1 px border
    grabbed_piece.style.left = (gameboard_cell_rect.left+1) + "px";
    grabbed_piece.style.top = (gameboard_cell_rect.top+1) + "px";

    // Set the piece as "placed" - so if a piece was never "snapped,"
    // don't let points get removed next time it is picked up
    grabbed_piece.brickus_placed = true;

    // Set the gameboard to register the pieces for the player
    // Start at the location of the upper left corner of the piece,
    // and iterate through the bitmap to set the gameboard
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            // Grab the char at the string
            index = (i*cols)+j;
            bit = +bitmap.charAt(index);
            if(bit){
                gameboard[i+gameboard_cell_row][j+gameboard_cell_col] = player;
            };
        }
    }
    calculate_points();
    drop_piece();
}



/**
    Returns the underlying gameboard_cell from the passed element, or null if it isn't under it

    @param element : IN. The element to search beneath (the top left corner).
    @return : The gameboard grid cell element if successful, or null if the gameboard is not under the top-left corner of the piece.

**/
function get_underlying_gameboard_cell(element) {
    var rect = element.getBoundingClientRect();
    var piece_x = rect.left;
    var piece_y = rect.top;

    // Locate the grid cell underneath the grabbed piece
    // look for the grid piece under the top left corner
    // To do this, quickly hide the grabbed piece and see what's underneath, then unhide it!
    element.style.visibility = "hidden";
    var gameboard_cell = get_underlying_gameboard_cell_by_point(piece_x, piece_y);
    element.style.visibility = "";

    return gameboard_cell;
}


function get_underlying_gameboard_cell_by_point(piece_x, piece_y){
    var gameboard_cell = document.elementFromPoint(piece_x, piece_y);
    if(gameboard_cell == null){
        return null;
    }

    // Let pieces snap to the grid if the underlying tile of a piece is an invisible piece,
    // but make sure to grab the underlying grid cell
    var i,temp;
    var hidden_stack = new Array();

    // Keep digging until either a gameboard cell is found or the root document html element
    // See http://stackoverflow.com/a/9488090
    while (document.documentElement !== gameboard_cell && !has_class(gameboard_cell, "gameboard-cell")){
        hidden_stack.push(gameboard_cell);
        gameboard_cell.style.visibility = "hidden";
        temp = document.elementFromPoint(piece_x, piece_y);
        gameboard_cell = temp;
    }

    // Unhide everything that was hidden
    for (i = hidden_stack.length - 1; i >= 0; i--) {
        temp = hidden_stack.pop();
        temp.style.visibility = "";
    }

    if(document.documentElement === gameboard_cell) {
        return null;
    }
    else {
        return gameboard_cell;
    }
}


/**
    searches beneath the passed coordinates until it finds a draggable piece
**/
function get_underlying_draggable_piece(element, piece_x, piece_y){
    var underlying_element = element;
    var last_piece;
    var hidden_stack = new Array();
    // When true, it means that the next piece found is draggable, so exit
    var stop_at_next_piece = false;

    // Keep digging until either the correct element is found or the root document html element
    do {
        underlying_element.style.visibility = "hidden";
        hidden_stack.push(underlying_element);
        underlying_element = document.elementFromPoint(piece_x, piece_y);
        // Remember the last piece element we touched
        if(!has_class(underlying_element, "etile") && has_class(underlying_element, "tile")){
            // The next piece selected will be a good piece
            stop_at_next_piece = true;
        }

        if(has_class(underlying_element, "piece")){
            last_piece = underlying_element;
        }
    }
    // Keep looping through until document is reached or stop is true and the element is a piece
    while(document.documentElement !== underlying_element && !(stop_at_next_piece && has_class(underlying_element, "piece")) );

    // Unhide everything that was hidden
    for (var i = hidden_stack.length - 1; i >= 0; i--) {
        hidden_stack.pop().style.visibility = "";
    }

    if(document.documentElement === underlying_element) {
        return null;
    }
    else {
        return last_piece;
    }
}






function drop_piece() {
    grabbed_piece = null;
    grab_relative_x = null;
    grab_relative_y = null;
}

function calculate_points() {
    var free_spaces = 0;
    var player1_score = 0;
    var player2_score = 0;
    var player3_score = 0;
    var player4_score = 0;

    // Update the point totals for all players
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
