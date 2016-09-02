<?php
    include "../models/games.php";
    include "../models/users.php";
    include "../models/pieces.php";
    session_name("brickus_session_id");
    session_start();

    $json_response = array(
        "data" => null,
        "success" => false,
        "msg" => null
    );


    // Check if the user is logged in
    if(!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] == false) {
        error_log("User is logged out. Ignoring ping request...");
        $json_response["msg"] = "User is logged out. User must be logged in to play Brickus";
        echo json_encode($json_response);
        exit();
    }

    // Figure out which user pinged
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

    // Create a server-side handler that returns game data and info in json form to an ajax call
    // Figure out if it's the pinging user's turn, and let them know if so

    $json_response["data"] = array(
        "game_id" => $current_game->id,
        "user_player_number" => $player_number,
        "player_turn" => $current_game->player_turn,
        "username" => $username,
    );


    $player1 = $users_model->query_user_by_id($current_game->player1_id);
    if($player1){
        $json_response["data"]["player1_username"] = $player1->username;
    }
    $player2 = $users_model->query_user_by_id($current_game->player2_id);
    if($player2){
        $json_response["data"]["player2_username"] = $player2->username;
    }
    $player3 = $users_model->query_user_by_id($current_game->player3_id);
    if($player3){
        $json_response["data"]["player3_username"] = $player3->username;
    }
    $player4 = $users_model->query_user_by_id($current_game->player4_id);
    if($player4){
        $json_response["data"]["player4_username"] = $player4->username;
    }


    // Return all the pieces placed during the game, so the client can sync and rerender the gameboard

    $all_pieces = $pieces_model->get_all_pieces_for_a_game($current_game->id);
    $json_response["data"]["all_pieces"] = $all_pieces;


    $json_response["msg"] = "Ping successful!";
    $json_response["success"] = true;
    echo json_encode($json_response);
    exit();







?>