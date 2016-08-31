<?php
    include "../models/games.php";
    include "../models/users.php";
    session_name("brickus_session_id");
    session_start();

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

    // TODO: Create a server-side handler that returns game data and info in json form to an ajax call
    // Figure out if it's the pinging user's turn, and let them know if so



    // Check to make sure that it truly is the user's turn

    $new_player_turn = $games_model->next_turn($current_game->id, $current_user->id);



    $json_response["data"] = array(
        "player_turn" => $new_player_turn,
        // "user_player_number" => $player_number,
        // "game_id" => $current_game->id,
        // "username" => $username,
    );

    // Check to make sure that the piece hasn't been used before (same piece == same rows, same columns, and same bitmask for the same player - create a mysql query for this)
    // Make sure the piece doesn't exceed a certain value (5 in this case). If it does, then must be a hack
    // TODO: This IS a vulnerability though - I'm trusting the user to not know how to send in a proper piece.... The server will need a whitelist of pieces to avoid this vulnerability

    // If so, create a new piece



    $json_response["msg"] = "Turn was successfully recorded!";
    $json_response["success"] = true;
    echo json_encode($json_response);
    exit();
?>