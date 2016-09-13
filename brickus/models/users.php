<?php

// TODO: Is this needed?
function generic_execption($exception) {
    error_log("Uncaught exception: ");
    error_log($exception->getMessage());
}
set_exception_handler('generic_execption');


// For a single row in Users
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

class Users {
    // Connect to the db
    private $hostname;
    private $db_name;
    private $db_user;
    private $db_password;
    private $dbh;

   function __construct() {
        // Connect to the db
        $this->hostname = "localhost";
        $this->db_name = "brickus";
        $this->db_user = "root";
        $this->db_password = "root";
        $this->dbh = new PDO("mysql:host=$this->hostname;dbname=$this->db_name", $this->db_user, $this->db_password);
   }


    /**
        Returns the user record if found, else it returns false.
    **/
    public function query_user($username) {
        // Prepare the sql statement
        $stmt = $this->dbh->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute(array($username));

        // Grab all the records returned from execute
        // For how to insert data directly into classes, see http://stackoverflow.com/a/368990
        // See http://php.net/manual/en/pdostatement.setfetchmode.php
        $stmt->setFetchMode(PDO::FETCH_INTO, new User);
        $returned_users = $stmt->fetchAll();

        if(count($returned_users)){
            return $returned_users[0];
        }
        else {
            // Could not find the user
            return false;
        }
    }


    /**
        Returns the user record if found, else it returns false.
    **/
    public function query_user_by_id($user_id) {
        // Prepare the sql statement
        $stmt = $this->dbh->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute(array($user_id));

        // Grab all the records returned from execute
        // For how to insert data directly into classes, see http://stackoverflow.com/a/368990
        // See http://php.net/manual/en/pdostatement.setfetchmode.php
        $stmt->setFetchMode(PDO::FETCH_INTO, new User);
        $returned_users = $stmt->fetchAll();

        if(count($returned_users)){
            return $returned_users[0];
        }
        else {
            // Could not find the user
            return false;
        }
    }





    public function create_user($username, $password, $repeat_password, $first_name=null, $last_name=null, $birthday=null) {
        $returned_user = $this->query_user($username);

       // Make sure that the username isn't already taken
        if($returned_user){
            echo "ERROR: Username \"" . $username . "\" already taken<br />";
            return false;
        }

        // Check to make sure the passwords match
        if($repeat_password !== $password){
            echo "ERROR: Passwords do not match<br />";
            return false;
        }

        // Hash the input password of the user
        $pwd_hash = password_hash($password, PASSWORD_DEFAULT);

        // Prepare the sql statement
        $stmt = $this->dbh->prepare("INSERT INTO users (username, first_name, last_name, password_hash, birthday) VALUES (:username, :first_name, :last_name, :password_hash, :birthday)");
        $stmt->execute(array(":username" => $username, ":password_hash" => $pwd_hash, ":first_name" => $first_name, ":last_name" => $last_name, ":birthday" => $birthday));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }


    public function verify_user($username, $password){
        $returned_user = $this->query_user($username);
        // Verify the save password using the save password hash
        if($returned_user && password_verify($password, $returned_user->password_hash)){
            return true;
        }
        else {
            return false;
        }
    }

}




?>