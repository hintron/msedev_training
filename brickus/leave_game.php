<?php
    include "models/games.php";
    include "models/users.php";
    session_name("brickus_session_id");
    session_start();

    // Check if the user is logged in
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        // TODO: Allow the user to leave from a game of their choosing, instead of only the current game

        $username = $_SESSION["username"];
        $games_model = new Games;
        $users_model = new Users;

        // Search for the first game possible
        $current_game = $games_model->get_current_game();
        if(!$current_game){
            echo 'There are no games in progress to leave from!';
        }
        else {
            // Remove the user from the game
            $current_user = $users_model->query_user($username);
            if($games_model->remove_user_to_game($current_game->id, $current_user->id)){
                echo 'successfully left the game';
            }
            else {
                echo 'Could not leave the game for some reason...';
            }
        }
        echo '<a href="dashboard.php">Return to dashboard</a>';
    }
    else {
        error_log("User is logged out");
        echo '<a href="index.php">Return to login page</a>';
    }

?>


