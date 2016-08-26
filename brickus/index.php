<?php
    session_name("brickus_session_id");
    session_start();
    // This will only echo the first time, when a session is created by the server
    if(SID){
        error_log("Creating new session: " . SID);
        error_log("Session cookie name: " . session_name());
    }

    // Check if the user is already logged in
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        echo "Welcome to the member's area, " . $_SESSION['username'] . "!<br>";
        // Go to the dashboard
        // See http://stackoverflow.com/a/9539996
        readFile("views/dashboard.html");

    } else {
        // echo "Please log in first to see this page.";
        // Output login html
        readFile("views/login.html");
    }


    if( isset( $_SESSION['counter'] ) ) {
        $_SESSION['counter'] += 1;
    }else {
        $_SESSION['counter'] = 1;
    }

    echo "You have visited this page ".  $_SESSION['counter'] . " times in this session.";
    session_commit();
?>
