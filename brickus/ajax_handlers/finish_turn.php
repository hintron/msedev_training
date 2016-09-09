<?php
    include "../models/games.php";
    include "../models/users.php";
    include "../models/pieces.php";
    session_name("brickus_session_id");
    session_start();


    // Create a server-side handler that returns game data and info in json form to an ajax call
    // Figure out if it's the pinging user's turn, and let them know if so


    $json_response = array(
        "data" => null,
        "success" => false,
        "msg" => null
    );

    // Check if the user is logged in
    if(!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] == false) {
        error_log("User is logged out. Ignoring finish turn request...");
        $json_response["msg"] = "User is logged out. User must be logged in to play Brickus";
        echo json_encode($json_response);
        exit();
    }


    // Figure out which user ended the turn
    $username = $_SESSION["username"];
    $games_model = new Games;
    $users_model = new Users;
    $pieces_model = new Pieces;

    // Search for the first game possible
    $current_game = $games_model->get_current_game();
    // Make sure there is a current game going on
    if(!$current_game){
        $json_response["msg"] = "There are no games currently active.";
        echo json_encode($json_response);
        exit();
    }

    $current_user = $users_model->query_user($username);
    // Make sure the current user exists in the db
    if(!$current_user){
        $json_response["msg"] = "The user " . $username . " is not registered in the db";
        echo json_encode($json_response);
        exit();
    }

    // Make sure the current user is part of the current game
    $player_number = $games_model->is_user_in_game($current_game->id, $current_user->id);
    if(!$player_number){
        $json_response["msg"] = "The user " . $username . " is not part of the currently active game";
        echo json_encode($json_response);
        exit();
    }

    // error_log("Player " . $current_user->username . "(" . $username . "): " . $player_number . "  ended their turn!");

    // Advance the turn
    $new_player_turn = $games_model->next_turn($current_game->id, $current_user->id);


    if(!isset($_POST["piece"])){
        $json_response["msg"] = "Turn completed successfully. No piece was recorded for this turn";
        $json_response["success"] = true;
        echo json_encode($json_response);
        exit();
    }



    // Make json decode turn it into an array
    // See http://stackoverflow.com/a/6815562
    $piece = json_decode($_POST["piece"], 1);
    // error_log(print_r($piece,1));


    if(!isset($piece["bitmap"]) || !isset($piece["cols"]) || !isset($piece["rows"]) || !isset($piece["id"])){
        error_log("ERROR: The passed piece did not have correct data!!!");
        $json_response["msg"] = "The passed piece did not have the correct information";
        echo json_encode($json_response);
        exit();
    }

    $piece_rows = $piece["rows"];
    $piece_cols = $piece["cols"];
    $piece_bitmap = $piece["bitmap"];
    $piece_id = $piece["id"];
    $piece_gameboard_x = $piece["gameboard_x"];
    $piece_gameboard_y = $piece["gameboard_y"];


    // Count the value of the piece from the bitmap
    $piece_value = substr_count($piece_bitmap, "1");
    // error_log("The piece value was " . $piece_value);

    // Ignore it if the value is impossible
    if($piece_value > $games_model::MAX_PIECE_VALUE){
        error_log("ERROR: The user passed a piece that had an impossible value!");
        $json_response["msg"] = "The user passed a piece that had an impossible value!";
        echo json_encode($json_response);
        exit();
    }

    // Check to make sure that the piece hasn't been used before (keep track of all the used ids)
    // TODO: This IS a vulnerability though - I'm trusting the user to not know how to send in a proper piece.... The server will need a whitelist of pieces to avoid this vulnerability

    $piece_rotate_id = null;
    if(isset($piece["rotate_id"])){
        $piece_rotate_id = $piece["rotate_id"];
    }
    else {
        error_log("rotate id is null! Assuming no rotation...");
    }

    // create a new piece if it is valid
    $piece_created = $pieces_model->create_piece($current_game->id, $piece_rows, $piece_cols, $piece_bitmap, $piece_gameboard_x, $piece_gameboard_y, $player_number, $piece_value, $piece_id, $piece_rotate_id);


    if($piece_created){
        $json_response["msg"] = "Piece was successfully recorded and turn is over!";
        $json_response["success"] = true;
        echo json_encode($json_response);
    }
    else {
        $json_response["msg"] = "Could not record the piece placement... Did you already place the same piece?";
        echo json_encode($json_response);
    }
    // TODO: Send back the scores of each player, so the client side can check and update


    exit();
?>