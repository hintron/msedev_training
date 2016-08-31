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
        error_log("User is logged out. Ignoring ping request...");
        $json_response["msg"] = "User is logged out. User must be logged in to play Brickus";
        echo json_encode($json_response);
        exit();
    }

    // Figure out which user pinged
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
    if(!$games_model->is_user_in_game($current_game->id, $current_user->id)){
        $json_response["msg"] = "The user " . $username . " is not part of the currently active game";
        echo json_encode($json_response);
        exit();
    }

    // TODO: Create a server-side handler that returns game data and info in json form to an ajax call
    // Figure out if it's the pinging user's turn, and let them know if so


    $json_response["msg"] = "Got here!";
    echo json_encode($json_response);
    exit();







?>