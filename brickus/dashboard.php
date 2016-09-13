<?php
    include "models/users.php";
    // Start the session at the top before anything else.
    // See http://stackoverflow.com/questions/8812754/cannot-send-session-cache-limiter-headers-already-sent
    // See http://stackoverflow.com/questions/1535697/how-do-php-sessions-work-not-how-are-they-used
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
    }
    else {
        $users_model = new Users;

        // Get user input
        $username = $_POST["username"];
        $password = $_POST["password"];
        $is_new_user = array_key_exists("new_user", $_POST);

        if($is_new_user){
            $repeat_password = $_POST["repeat_password"];

            if($users_model->create_user($username, $password, $repeat_password)){
                echo "Registered user \"" . $username . "\"!!<br/>";
            }
            else {
                echo "ERROR: Failed to register user \"" . $username . "\"<br />";
                exit();
            }
        }
        else {
            // Verify the save password using the save password hash
            if($users_model->verify_user($username, $password)){

            }
            else {
                echo "ERROR: Failed to authenticate user \"" . $username . "\"<br />";
                exit();
            }
        }

        // echo "Password verified!<br/>";
        echo 'Welcome, ' . $username . '!<br />';
        error_log("Setting session variable to keep track of user...");
        // Set session variable to know who is logged in
        // See http://stackoverflow.com/a/1545422
        $_SESSION["logged_in"] = true;
        $_SESSION["username"] = $username;
        session_commit();
    }

    // Go to the dashboard
    // See http://stackoverflow.com/a/9539996
    readFile("views/dashboard.html");
?>