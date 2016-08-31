<?php
    include "models/games.php";
    include "models/users.php";
    session_name("brickus_session_id");
    session_start();

    // Check if the user is logged in
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        // TODO: Allow the user to end a game of their choosing, instead of only the current game

        $username = $_SESSION["username"];
        $games_model = new Games;
        $users_model = new Users;

        // Search for the first game possible
        $current_game = $games_model->get_current_game();
        if(!$current_game){
            echo 'There are no games in progress to end!<br/>';
        }
        else {
            // End the current game
            $current_user = $users_model->query_user($username);
            if($games_model->end_game($current_game->id, $current_user->id)){
                echo 'successfully ended the game<br/>';
            }
            else {
                echo 'Could not end the game for some reason...<br/>';
            }
        }
        readfile("views/dashboard.html");
    }
    else {
        error_log("User is logged out");
        echo '<a href="index.php">Return to login page</a>';
    }

?>


