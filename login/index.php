 <?php
    //
    //// Project 7 - Login System
    //

    // Symlink the parent public "login" folder into MAMP/htdocs with the following command:
    // ln -s /Users/mghinton/Documents/msedev_training/login /Applications/MAMP/htdocs/login
    // ln -s should always use absolute references or it will mess up! See http://ss64.com/bash/ln.html
    // Then input this link into the browser to execute this file:
    // http://localhost:8888/login/
    echo "Hello, World!<br/>";

    // Listen to the error log with the following command:
    // (It won't exist until something is printed to it)
    // tail -f /Applications/MAMP/logs/php_error.log
    error_log("What's up!");


    // I decided to use PHP PDO instead of mysqli because it can load data straight
    // into classes and it also is database agnostic, so it is portable code.

    // For how to insert data directly into classes, see http://stackoverflow.com/a/368990



    // I created my dbs using utf8_general_ci so n and ñ are sorted next to each other
    // See http://stackoverflow.com/a/367731


    // Hash the input password of the user
    // See https://alias.io/2010/01/store-passwords-safely-with-php-and-mysql/
    // http://php.net/manual/en/function.password-hash.php


    $password = "mytestpassword";
    $username = "hintron";


    // This will salt and stretch a password with a random salt
    // The used algorithm, cost, and salt are returned as part of the hash
    $passkey = password_hash($password, PASSWORD_DEFAULT);

    if(password_verify($password, $passkey)){
        echo "Password verified: $passkey<br/>";

    }
    else {
        echo "Password incorrect: $passkey<br/>";
    }

    // TODO: Create an input form and get it submitting to this php code
    // TODO: Figure out how to use PDO with MySQL
    // TODO: Create a "User" class
    // TODO: Save the passkey to the db


    // try
    // {
    //     $dbh = new PDO("mysql:host=$hostname;dbname=school", $username, $password)

    //     $stmt = $dbh->query("SELECT * FROM students");

    //     /* MAGIC HAPPENS HERE */
    //     $stmt->setFetchMode(PDO::FETCH_INTO, new Student);

    //     // foreach($stmt as $student) {
    //     //     echo $student->getFullName().'<br />';
    //     // }

    //     $dbh = null;
    // }
    // catch(PDOException $e)
    // {
    //     echo $e->getMessage();
    // }


?>