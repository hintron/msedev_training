<?php
    session_name("brickus_session_id");
    session_start();

    // Check if the user is already logged in
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        error_log($_SESSION['username'] . " wants to log out");
        // Destroy the session to effectively forget the currently logged-in user!
        // For how to log out, see http://php.net/manual/en/function.session-destroy.php
        // See also http://stackoverflow.com/a/3948312

        // Unset all of the session variables.
        $_SESSION = array();

        // Destroying the session doesn't delete the session cookie on the client
        // So set the cookie to expire 1 day ago
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            // http://stackoverflow.com/questions/686155/remove-a-cookie/14001301#14001301
            setcookie(session_name(), '', time() - 86400, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
        }
        // Unset the cookie global array on the server as well
        if (isset($_COOKIE[session_name()])) {
            unset($_COOKIE[session_name()]);
        }

        session_destroy();

        // NOTE: Currently, the session will expire every time the browser is closed.
        // To have the user stay logged even after the browser is closed, need to set a timeout.
        // This is nuanced. See http://stackoverflow.com/questions/520237/how-do-i-expire-a-php-session-after-30-minutes


        echo '<a href="index.php">Return to login page</a>';
    }
    else {

        error_log("User is already logged out");
    }
?>


