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


    error_log("Finish Turn handler!");




    // Check to make sure that it truly is the user's turn

    // Check to make sure that the piece hasn't been used before (same piece == same rows, same columns, and same bitmask for the same player - create a mysql query for this)
    // Make sure the piece doesn't exceed a certain value (5 in this case). If it does, then must be a hack
    // TODO: This IS a vulnerability though - I'm trusting the user to not know how to send in a proper piece.... The server will need a whitelist of pieces to avoid this vulnerability

    // If so, create a new piece



    $json_response["msg"] = "Turn was successfully recorded!";
    $json_response["success"] = true;
    echo json_encode($json_response);
    exit();
?>