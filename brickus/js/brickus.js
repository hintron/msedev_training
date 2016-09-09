$(function(){
    //
    //// Attach event handlers and initialize code
    //

    // See this for setting event handlers: http://stackoverflow.com/a/6348597

    // Set an event listener for the r button, to rotate a piece
    $(window).on("keyup", function(event) {
        if (event.keyCode == R_KEY) {
            // Find the piece underneath the current mousepointer
            var underlying_el = document.elementFromPoint(current_mouse_pos_x, current_mouse_pos_y);
            var underlying_piece = $(underlying_el).parents(".piece");

            if(underlying_piece.length){
                rotate_piece(underlying_piece);
            }
            else {
                // console.log("Could not find a piece to rotate under the mouse!");
            }
        }
    });

    // See http://stackoverflow.com/a/6802970 for moving html elements
    var pieces = $(".piece");
    for (var i = pieces.length - 1; i >= 0; i--) {
        var piece = $(pieces[i]);
        piece.on("mousedown", mousedown_handler);
        // Set all pieces to absolute positioning now that they are rendered
        // Get bounding rect
        // See http://stackoverflow.com/a/11396681
        var rect = pieces[i].getBoundingClientRect();
        piece.css( "position", "absolute");
        // Reset the coordinates to where it was, since setting to absolute move the piece
        piece.css( "left", (rect.left + window.pageXOffset) + "px");
        piece.css( "top", (rect.top + window.pageYOffset) + "px");
    }
    $(window).on("mousemove", mousemove_handler);
    $(window).on("mouseup", mouseup_handler);

    $("#finish_turn_btn").on("click", finish_turn_handler);

    // Turn on pinging
    start_pinging();
});

// r is keycode 82
const R_KEY = 82;
const MAX_HEIGHT = 700;
const GAMEBOARD_WIDTH = 12;
const GAMEBOARD_CELL_WIDTH = 30;
const GAMEBOARD_CELL_HALF_WIDTH = GAMEBOARD_CELL_WIDTH/2;
const GAMEBOARD_CELL_BORDER_WIDTH = 1;
const GAMEBOARD_BORDER_OFFSET = 2 * GAMEBOARD_CELL_BORDER_WIDTH;
// The offset is to find the neighbors of the currently selected gameboard cell
const GAMEBOARD_CELL_OFFSET = GAMEBOARD_CELL_WIDTH + GAMEBOARD_CELL_HALF_WIDTH;

// If not null, then it means it is grabbed and should move around
var grabbed_piece = null;
// These are the coordinates of the grab location relative to the upper-left corner of the grabbed piece
var grab_relative_x = null;
var grab_relative_y = null;


var current_mouse_pos_x = null;
var current_mouse_pos_y = null;



// If true, pinging will be allowed to run. If false, it will stop running.
var pinging_active = false;

// A monotonically increasing z value for every time a piece is touched.
// This will never realistically overflow with regular human use
var global_z_count = 1;

// Player constants
const PLAYER_1 = 1;
const PLAYER_2 = 2;
const PLAYER_3 = 3;
const PLAYER_4 = 4;

var PLAYER_COLORS = [];
PLAYER_COLORS[PLAYER_1] = "Yellow";
PLAYER_COLORS[PLAYER_2] = "Blue";
PLAYER_COLORS[PLAYER_3] = "Red";
PLAYER_COLORS[PLAYER_4] = "Green";

// Keep track of whose turn it is
var player_turn = null;


// The server will tell the client what color she/he is
var current_user_player_number = null;


// Only let the user place one piece per turn
// Keep track of the piece that was placed this turn
// If this var is null, it means that no piece is placed yet
// It will contain a gameboard x and y, the coordinates of the piece on the gameboard
var last_snapped_piece = null;

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

// Start up the pinging service
// Only allow the ping if it is not the client player's own turn
function start_pinging(){
    pinging_active = true;

    // Create a periodic AJAX ping to the server
    // See http://stackoverflow.com/a/5052661
    // This will keep running until pinging_active is set to false
    (function ping_worker() {
        $.ajax({
            url: 'ajax_handlers/ping.php',
            dataType: "json",
            success: function(json) {

                // Figure out which player number (color) the current user is and set it ONE time
                if(!current_user_player_number){
                    switch (+json.data.user_player_number){
                        case 1:
                            current_user_player_number = 1;
                            break;
                        case 2:
                            current_user_player_number = 2;
                            break;
                        case 3:
                            current_user_player_number = 3;
                            break;
                        case 4:
                            current_user_player_number = 4;
                            break;
                        default:
                            console.log("Could not determine what color the user is...");
                            break;
                    }
                }

                // Set all the playernames as the users
                if(json.data.player1_username){
                    $("#player1_name").html(json.data.player1_username + "'s Score:");
                }
                if(json.data.player2_username){
                    $("#player2_name").html(json.data.player2_username + "'s Score:");
                }
                if(json.data.player3_username){
                    $("#player3_name").html(json.data.player3_username + "'s Score:");
                }
                if(json.data.player4_username){
                    $("#player4_name").html(json.data.player4_username + "'s Score:");
                }

                // Add a (YOU) to indicate which color you are
                var user_score_name = $("#player" + current_user_player_number + "_name");
                user_score_name.text(user_score_name.text() + "(YOU)");


                // Set whose turn it is if yet unknown or if it is a new player's turn
                if(!player_turn || player_turn != +json.data.player_turn){
                    console.log("Detected a change in player turn!");
                    // Don't play the sound on page refresh
                    if(player_turn){
                        turn_changed_sound();
                    }

                    player_turn = +json.data.player_turn;
                    // update the current player displayed
                    $("#player_turn").html(PLAYER_COLORS[player_turn]);
                    // Remove all classes, then add the class for the current player's turn
                    $("#header_container").removeClass().addClass("player" + player_turn);
                    // If it's the user's turn, turn off pinging until he/she finishes the turn
                    if(player_turn == current_user_player_number){
                        console.log("It's your turn! Turn off pinging while you figure out your next move...");
                        stop_pinging();
                    }
                }


                var all_pieces = json.data.all_pieces;
                // console.log(all_pieces);

                // Reset the gameboard
                reset_gameboard();

                // loop through and render each piece to the game board
                if(all_pieces){
                    var temp_piece;
                    var temp_piece_el;
                    var temp_gameboard = $("#gameboard");
                    var temp_new_location;
                    for (var i = 0; i < all_pieces.length; i++) {
                        temp_piece = all_pieces[i];

                        // Figure out if the piece is a rotated piece or not
                        if(temp_piece.html_piece_rotate_id){
                            // Get the right rotated variant of the piece!
                            temp_piece_el = $(".piece[data-id='" + temp_piece.html_piece_id + "'][data-player='" + temp_piece.player_number + "'][data-rotate-id='" + temp_piece.html_piece_rotate_id + "']");
                        }
                        else {
                            temp_piece_el = $(".piece[data-id='" + temp_piece.html_piece_id + "'][data-player='" + temp_piece.player_number + "']");
                        }
                        // If this is a hidden piece, unhide it and hide the other one
                        if(temp_piece_el.hasClass("hidden")){
                            // Find the unhidden one and hide it
                            $(".piece[data-id='" + temp_piece.html_piece_id + "'][data-player='" + temp_piece.player_number + "']").not(".hidden").addClass("hidden");
                            // Unhide the rotated piece variant that was actually used
                            temp_piece_el.removeClass("hidden");
                        }

                        if(temp_piece_el.length == 0){
                            console.log(all_pieces);
                            console.log(temp_piece);
                            alert("The game is messed up. Can't find the piece with the passed id");
                            continue;
                        }

                        // Find the gameboard location and move the piece to the correct spot on the gameboard
                        temp_new_location = temp_gameboard.offset();
                        temp_new_location.left = temp_new_location.left + (temp_piece.gameboard_x * (GAMEBOARD_CELL_WIDTH+GAMEBOARD_CELL_BORDER_WIDTH)) + GAMEBOARD_CELL_BORDER_WIDTH;
                        temp_new_location.top = temp_new_location.top + (temp_piece.gameboard_y * (GAMEBOARD_CELL_WIDTH+GAMEBOARD_CELL_BORDER_WIDTH)) + GAMEBOARD_CELL_BORDER_WIDTH;
                        temp_piece_el.offset(temp_new_location);

                        // Register piece to the gameboard
                        register_gameboard_piece(+temp_piece.gameboard_x, +temp_piece.gameboard_y, temp_piece.bitmap, temp_piece.rows, temp_piece.cols, +temp_piece.player_number);

                        // Set the inner piece element as snapped to gameboard, so user can't move it (as long as it's not the last snapped piece)
                        temp_piece_el[0].snapped_to_gameboard = true;
                    }
                }

                // Update the scoreboard
                calculate_points();
            },

            // Note: Complete executes after success does
            complete: function() {
                if(pinging_active){
                    // Schedule the next request when the current one's complete
                    setTimeout(ping_worker, 5000);
                }
            }
        });
    })();
}


// Turns off pinging
function stop_pinging(){
    your_turn_sound();
    pinging_active = false;
}




function reset_gameboard() {
    // For how to clear arrays, see http://stackoverflow.com/a/1234337
    // Setting length to 0 automatically deletes all indexed values that are >= 0
    for (var i = 0; i < GAMEBOARD_WIDTH; i++) {
        gameboard[i].length = 0;
    }
}


/**
    Registers the piece to the gameboard for the passed player
**/
function register_gameboard_piece(gameboard_x, gameboard_y, piece_bitmap, piece_rows, piece_cols, player_number) {
    // and iterate through the bitmap to set the gameboard
    for (i = 0; i < piece_rows; i++) {
        for (j = 0; j < piece_cols; j++) {
            // Grab the char at the string
            index = (i*piece_cols)+j;
            bit = +piece_bitmap.charAt(index);
            if(bit){
                gameboard[i+gameboard_y][j+gameboard_x] = player_number;
            };
        }
    }
}



function clear_gameboard_piece(gameboard_x, gameboard_y, piece_bitmap, piece_rows, piece_cols) {
    var i,j,bit,index;
    // Clear the gameboard of the points of the selected piece
    for (i = 0; i < piece_rows; i++) {
        for (j = 0; j < piece_cols; j++) {
            // Grab the char at the string
            index = (i*piece_cols)+j;
            bit = +piece_bitmap.charAt(index);
            if(bit){
                // Clear the piece from the global gameboard array
                gameboard[i+gameboard_y][j+gameboard_x] = 0;
            };
        }
    }
}


/**
    Checks to see if the passed piece can fit on the gameboard at the passed location

    return: True if the piece can be placed on the gameboard at the designated coordinates
**/
function does_gameboard_piece_fit(gameboard_x, gameboard_y, piece_bitmap, piece_rows, piece_cols) {
    var i,j,bit,index;
    // Check to make sure the piece is not going over other pieces
    for (i = 0; i < piece_rows; i++) {
        for (j = 0; j < piece_cols; j++) {
            // Grab the char at the string
            index = (i*piece_cols)+j;
            bit = +piece_bitmap.charAt(index);
            if(bit && gameboard[i+gameboard_y][j+gameboard_x]){
                return false;
            };
        }
    }

    return true;
}



// Change the turn
function finish_turn_handler() {
    // Only let users end their own turn
    if(player_turn != current_user_player_number){
        console.log("It's not your turn! Can't finish the turn");
        return;
    }

    console.log(last_snapped_piece);

    // Send data on the piece that was placed
    // NOTE: Don't need to send player info, since that will be contained in the session vars
    var data = {};
    if(last_snapped_piece){
        data.piece = JSON.stringify({
            rows:last_snapped_piece.dataset.rows,
            cols:last_snapped_piece.dataset.cols,
            id:last_snapped_piece.dataset.id,
            rotate_id:last_snapped_piece.dataset.rotateId,
            bitmap:last_snapped_piece.dataset.bitmap,
            gameboard_x:last_snapped_piece.gameboard_x,
            gameboard_y:last_snapped_piece.gameboard_y,
        });

        // Clear the last snapped piece
        last_snapped_piece.gameboard_x = null;
        last_snapped_piece.gameboard_y = null;
        last_snapped_piece = null;
        $("#finish_turn_btn").removeClass("bold");
    }

    // Send a "turn finished" ajax call to the server
    var jqxhr = $.ajax({
        url: "ajax_handlers/finish_turn.php",
        dataType: "json",
        method: "POST",
        data: data,
    });

    // Use promises!
    jqxhr.done(function(json) {
        // Turn on pinging again
        start_pinging();
    });

}

function mousedown_handler(mouse_event) {
    // Do not allow any pieces to be picked up if not user's turn
    if(player_turn != current_user_player_number){
        console.log("It's not your turn!");
        return;
    }


    // NOTE: If the element that emitted the event is just a tile_row,
    // it means that an etile was underneath it. So ignore it.
    if($(mouse_event.target).hasClass("tile_row")){
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

    // Have a check to make sure that players can only select their own pieces
    if(player_turn && player_turn != grabbed_piece.dataset.player){
        console.log("Cannot select a piece that is not yours!");
        drop_piece();
        return;
    }




    // Erase the points on the gameboard if the piece is picked up off the gameboard
    var gameboard_cell = get_underlying_gameboard_cell(grabbed_piece);
    if(gameboard_cell && grabbed_piece.snapped_to_gameboard){
        // Drop the piece if it is not the last piece played by that player
        if(!last_snapped_piece || grabbed_piece !== last_snapped_piece){
            console.log("Can only remove the one piece you snapped to the grid this turn!");
            drop_piece();
            return;
        }

        grabbed_piece.snapped_to_gameboard = false;

        // Unset the placed piece for this turn
        last_snapped_piece.gameboard_x = null;
        last_snapped_piece.gameboard_y = null;
        last_snapped_piece = null;
        $("#finish_turn_btn").removeClass("bold");

        // Figure out what index the gameboard_cell is at
        var gameboard_cell_col = +gameboard_cell.dataset.column;
        var gameboard_cell_row = +gameboard_cell.parentElement.dataset.row;

        // Read the data-* html attributes for info on the pieces
        var bitmap = grabbed_piece.dataset.bitmap;
        var cols = +grabbed_piece.dataset.cols;
        var rows = +grabbed_piece.dataset.rows;

        clear_gameboard_piece(gameboard_cell_col, gameboard_cell_row, bitmap, rows, cols);

        // Update the scoreboard
        calculate_points();
    }
    else {
        // console.log("Grabbed piece was not snapped to gameboard");
    }

    // Save the grab position relative to the piece
    var grabbed_piece_rect = grabbed_piece.getBoundingClientRect();
    var grabbed_piece_x = grabbed_piece_rect.left + window.pageXOffset;
    var grabbed_piece_y = grabbed_piece_rect.top + window.pageYOffset;

    // Save the location of mouse within the piece
    grab_relative_x = mouse_event.pageX - grabbed_piece_x;
    grab_relative_y = mouse_event.pageY - grabbed_piece_y;

    // Make sure the currently grabbed piece has the highest z value
    // With a monotonically increasing z number, the most recently
    // touched piece will be displayed on top
    grabbed_piece.style.zIndex = global_z_count;
    global_z_count++;
}

function mousemove_handler(mouse_event) {
    if(grabbed_piece){
        // Don't move the piece if it goes out of the screen

        var mouse_x = mouse_event.pageX;
        var mouse_y = mouse_event.pageY;

        // TODO: Why are pieces freezing the game when hit bottom?
        if(mouse_x < grab_relative_x || mouse_y < grab_relative_y /*|| mouse_y > MAX_HEIGHT-grab_relative_y*/){
            return;
        }

        // piece needs to be set to absolute for this to work
        grabbed_piece.style.left = (mouse_x - grab_relative_x) + "px";
        grabbed_piece.style.top = (mouse_y - grab_relative_y) + "px";
    }

    // Save the current location of the mouse for rotation
    current_mouse_pos_x = mouse_event.pageX;
    current_mouse_pos_y = mouse_event.pageY;
}

function mouseup_handler(mouse_event) {
    if(!grabbed_piece) {
        // ignore if no piece is grabbed
        return;
    }

    // Do not let user snap piece to the grid if they already snapped one this turn
    if(last_snapped_piece){
        console.log("Do not let user snap piece to the grid if they already snapped one this turn");
        drop_piece();
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

    // NOTE: Only snap to visible points (don't account for scrolling by adding offsets),
    // because get_underlying_gameboard_cell_by_point() only deals with visible points

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

    if(!does_gameboard_piece_fit(gameboard_cell_col, gameboard_cell_row, bitmap, rows, cols)){
        drop_piece();
        return;
    }

    var gameboard_cell_rect = gameboard_cell.getBoundingClientRect();
    // piece css needs to be set to absolute for this to work
    // Make sure to factor in the 1 px border
    grabbed_piece.style.left = (gameboard_cell_rect.left + window.pageXOffset+1) + "px";
    grabbed_piece.style.top = (gameboard_cell_rect.top + window.pageYOffset+1) + "px";

    // Set the piece as "placed" - so if a piece was never "snapped,"
    // don't let points get removed next time it is picked up
    grabbed_piece.snapped_to_gameboard = true;
    // Set the grabbed piece as the last piece snapped to the grid
    last_snapped_piece = grabbed_piece;
    last_snapped_piece.gameboard_x = gameboard_cell_col;
    last_snapped_piece.gameboard_y = gameboard_cell_row;
    $("#finish_turn_btn").addClass("bold");

    register_gameboard_piece(gameboard_cell_col, gameboard_cell_row, bitmap, rows, cols, player);

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
    // NOTE: the x and y coordinates need to be relative to the viewport, not the document
    // (i.e. do not compensate for scrolling)
    element.style.visibility = "hidden";
    var gameboard_cell = get_underlying_gameboard_cell_by_point(piece_x, piece_y);
    element.style.visibility = "";

    return gameboard_cell;
}

/**
    NOTE: elementFromPoint() takes VISIBLE points, so the passed coordinates need to be relative to the viewport
    (top-left corner of the visible area, regardless of scrolling). So this means it takes clientX, not pageX, and
    window.pageXOffset should NOT be added to el.getBoundingClientRect().left or .top.
    See https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
    Also, see http://stackoverflow.com/questions/9262741/what-is-the-difference-between-pagex-y-clientx-y-screenx-y-in-javascript?noredirect=1&lq=1

    @param piece_x : IN. The x coordinate relative to the current viewport, not the document (i.e. clientX, not pageX)
    @param piece_y : IN. The y coordinate relative to the viewport

    @return : The gameboard grid cell element if successful, or null if the gameboard is not under the top-left corner of the piece.
**/
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
    while (document.documentElement !== gameboard_cell && !$(gameboard_cell).hasClass("gameboard-cell")){
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
    Searches beneath the passed coordinates until it finds a draggable piece

    @param element : IN. The element to look under (looks under the top left corner)
    @param piece_x : IN. The x coordinate relative to the current viewport, not the document (i.e. don't add scrollXOffset)
    @param piece_y : IN. The y coordinate relative to the viewport

    @return : The next draggable piece underneath, or null if none.
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
        if(!$(underlying_element).hasClass("etile") && $(underlying_element).hasClass("tile")){
            // The next piece selected will be a good piece
            stop_at_next_piece = true;
        }

        if($(underlying_element).hasClass("piece")){
            last_piece = underlying_element;
        }
    }
    // Keep looping through until document is reached or stop is true and the element is a piece
    while(document.documentElement !== underlying_element && !(stop_at_next_piece && $(underlying_element).hasClass("piece")) );

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
    $("#player1_score").html(player1_score);
    $("#player2_score").html(player2_score);
    $("#player3_score").html(player3_score);
    $("#player4_score").html(player4_score);
}



// Play a sound!
// Roylty-free sounds taken from http://soundbible.com/royalty-free-sounds-1.html
// See https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
// and https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
function turn_changed_sound() {
    sound = new Audio("sound/next_turn.mp3");
    sound.play();

}

function your_turn_sound() {
    sound = new Audio("sound/your_turn.mp3");
    sound.play();
}







/**
    Rotate the currently selected piece

    @param piece: IN. The jquery-wrapped piece to rotate

**/
function rotate_piece(piece) {
    // Do not allow rotation during piece movement
    if(grabbed_piece){
        console.log("Can't rotate a piece when another piece is grabbed!");
        return;
    }

    // Make sure that the next piece to rotate isn't already placed on the gameboard
    // If it is, then this is an illegal move, and actually should never happen
    if(piece[0].snapped_to_gameboard){
        console.log("Can't rotate a piece that is on the gameboard!");
        return;
    }

    var original = piece;
    var rotate_count = original.data("rotate-count");
    var original_piece_id = piece.data("id");
    var original_piece_player = piece.data("player");

    // Make sure the rotated piece is the current player's
    if(original_piece_player != current_user_player_number){
        // console.log("Can't rotate a piece that is not yours!");
        return;
    }

    // Only rotate pieces that are designated as able to be rotated
    if(!rotate_count){
        // console.log("The piece has not rotation variants");
        return;
    }

    // Move the piece to where the original piece was
    var original_coordinates = original.offset();
    var original_rotate_id = original.data("rotate-id");
    var next_rotate_id = original_rotate_id + 1;

    // Loop back around if we rotate past the last rotate variant
    if(next_rotate_id > rotate_count){
        next_rotate_id = 1;
    }


    // Get the next piece to rotate to
    var rotated = $("[data-id='" + original_piece_id + "'][data-player='" + original_piece_player + "'][data-rotate-id='" + next_rotate_id + "']");

    // Move the rotated piece to where the original was
    rotated.offset(original_coordinates).removeClass("hidden");
    // Hide the original
    original.addClass("hidden");


    // TODO: Reset the z on the rotated piece
}

