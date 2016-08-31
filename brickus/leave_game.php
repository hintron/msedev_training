<?php
    session_name("brickus_session_id");
    session_start();

    // Check if the user is logged in
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {

        // TODO: Search for the first game possible

        // TODO: Remove the user from the game

        // TODO: Allow the user to leave from a game of their choosing, instead of only the current game


        echo '<a href="index.php">Return to login page</a>';
    }
    else {

        error_log("User is logged out");
    }
?>


