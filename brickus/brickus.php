<?php
    include "models/games.php";
    include "models/users.php";


    session_name("brickus_session_id");
    session_start();

    // Check to make sure the user is logged in
    if(!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] == false) {
        echo "You are not logged in! Redirecting to login page...";
        readfile("views/login.html");
        exit();
    }


    $username = $_SESSION["username"];

    $games_model = new Games;
    $users_model = new Users;

    $current_user = $users_model->query_user($username);

    if(!$current_user){
        echo "The user you are logged in as does not exist in the db... Something went wrong...";
        readfile("views/login.html");
        exit();
    }

    // Check to make sure the user is part of the current game
    $current_game = $games_model->get_current_game();
    if(!$current_game){
        error_log("There are no games in progress! Creating a new game and adding user to the game...");
        $games_model->create_game($current_user->id);
    }
    else {
        error_log("Game in progress!");

        // Check to see if there is an opening in the current game
        // If so, add the user to the game
        // Else, say the current game is full
        if(!$games_model->is_user_in_game($current_game->id, $current_user->id)){
            if(!$games_model->add_user_to_game($current_game->id, $current_user->id)){
                echo "Sorry; the current game is full. Please try again later.";
                readfile("views/dashboard.html");
                exit();
            }
            error_log("Added user to game!");
        }
    }
    error_log("User is part of the current game! Going to game now...");

    // TODO: Somehow associate the game to the html brickus game

    readfile("views/brickus.html");


?>