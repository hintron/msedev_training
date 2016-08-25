<?php
    //
    //// Project 7 - Login System (eventually for brickus)
    //

    // TODO: Eventually only allow 4 registered users to log in at a time

    // TODO: Create an input form and get it submitting to this php code
    // TODO: Figure out how to use PDO with MySQL
    // TODO: Save the passkey to the db

    // Symlink the parent public "login" folder into MAMP/htdocs with the following command:
    // ln -s /Users/mghinton/Documents/msedev_training/login /Applications/MAMP/htdocs/login
    // ln -s should always use absolute references or it will mess up! See http://ss64.com/bash/ln.html
    // Then input this link into the browser to execute this file:
    // http://localhost:8888/login/

    // Listen to the error log with the following command:
    // (It won't exist until something is printed to it)
    // tail -f /Applications/MAMP/logs/php_error.log

    // I created my dbs using utf8_general_ci so n and ñ are sorted next to each other
    // See http://stackoverflow.com/a/367731

    class User {
        // These properties need to match the db fields exactly
        public $id;
        public $username;
        public $first_name;
        public $last_name;
        public $password_hash;
        public $birthday;

        public function getFullName() {
            return $this->first_name . ' ' . $this->last_name;
        }
    }



    // Get user input

    error_log(print_r($_POST,1));
    $username = $_POST["username"];
    $password = $_POST["password"];
    if(array_key_exists("new_user", $_POST)){
        error_log("Registering new user!");
    }
    else {
        error_log("Authenticating user!");
    }




    // I decided to use PHP PDO instead of mysqli because it can load data straight
    // into classes and it also is database agnostic, so it is portable code.

    // For the PHP PDO docs, see http://php.net/manual/en/book.pdo.php
    // http://php.net/manual/en/class.pdo.php
    // http://php.net/manual/en/class.pdostatement.php
    try {
        // Connect to the db
        $hostname = "localhost";
        $db_name = "brickus";
        $db_user = "root";
        $db_password = "root";
        $dbh = new PDO("mysql:host=$hostname;dbname=$db_name", $db_user, $db_password);

        // Prepare the sql statement
        $stmt = $dbh->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute(array($username));

        // Grab all the records returned from execute
        // For how to insert data directly into classes, see http://stackoverflow.com/a/368990
        // See http://php.net/manual/en/pdostatement.setfetchmode.php
        $stmt->setFetchMode(PDO::FETCH_INTO, new User);
        $return = $stmt->fetchAll();
        // error_log(print_r($stmt,1));
        // error_log(print_r($return,1));

        // Hash the input password of the user
        // See https://alias.io/2010/01/store-passwords-safely-with-php-and-mysql/
        // http://php.net/manual/en/function.password-hash.php

        // This will salt and stretch a password with a random salt
        // The used algorithm, cost, and salt are returned as part of the hash
        // $passkey = password_hash($password, PASSWORD_DEFAULT);

        if(count($return) && password_verify($password, $return[0]->password_hash)){
            echo "Password verified!<br/>";
            echo 'Welcome, ' . $username . '!<br />';
        }
        else {
            echo "ERROR: Failed to authenticate user \"" . $username . "\"<br />";
        }
        $dbh = null;
    }
    catch(PDOException $e) {
        error_log("PDO Error:");
        error_log($e->getMessage());
    }


?>