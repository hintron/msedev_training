<?php
    session_name("brickus_session_id");
    session_start();

    // TODO: Check to make sure the user is logged in
    if(!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] == false) {
        echo "You are not logged in! Redirecting to login page...";
        readfile("views/login.html");
        exit();
    }


    // TODO: Check to make sure the user is part of the current game
    readfile("views/brickus.html");







?>