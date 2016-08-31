<?php

// For a single row in Users
class Game {
    // These properties need to match the db fields exactly
    public $id;
    public $player1_id;
    public $player2_id;
    public $player3_id;
    public $player4_id;
    public $player_turn;
    public $player1_score;
    public $player2_score;
    public $player3_score;
    public $player4_score;
    public $in_progress;
}

class Games {
    // Connect to the db
    private $hostname;
    private $db_name;
    private $db_user;
    private $db_password;
    private $dbh;
    private $table_name;

   function __construct() {
        // Connect to the db
        $this->hostname = "localhost";
        $this->db_name = "brickus";
        $this->db_user = "root";
        $this->db_password = "root";
        $this->table_name = "games";
        $this->dbh = new PDO("mysql:host=$this->hostname;dbname=$this->db_name", $this->db_user, $this->db_password);
   }


   // TODO: Instead of only having one game possible at a time, have multiple games and let the user select which game to play
    public function get_current_game() {
        // Prepare the sql statement
        $stmt = $this->dbh->prepare("SELECT * FROM $this->table_name WHERE in_progress = 1");
        $stmt->execute();

        // Grab all the records returned from execute
        // For how to insert data directly into classes, see http://stackoverflow.com/a/368990
        // See http://php.net/manual/en/pdostatement.setfetchmode.php
        $stmt->setFetchMode(PDO::FETCH_INTO, new Game);
        $returned_games = $stmt->fetchAll();

        if(count($returned_games)){
            // For now, return the first game in progress
            return $returned_games[0];
        }
        else {
            return false;
        }
    }


    public function query_game($game_id) {
        // Prepare the sql statement
        $stmt = $this->dbh->prepare("SELECT * FROM $this->table_name WHERE id = ?");
        $stmt->execute(array($game_id));

        // Grab all the records returned from execute
        // For how to insert data directly into classes, see http://stackoverflow.com/a/368990
        // See http://php.net/manual/en/pdostatement.setfetchmode.php
        $stmt->setFetchMode(PDO::FETCH_INTO, new Game);
        $returned_games = $stmt->fetchAll();

        // For now, return the first game in progress
        return $returned_games[0];
    }





    public function create_game($user_id) {
        // Prepare the sql statement
        $stmt = $this->dbh->prepare("INSERT INTO $this->table_name (player1_id, in_progress) VALUES (?, 1)");
        $stmt->execute(array($user_id));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }



    public function is_user_in_game($game_id, $user_id){
        $game = $this->query_game($game_id);
        if($game->player1_id == $user_id || $game->player2_id == $user_id || $game->player3_id == $user_id || $game->player4_id == $user_id){
            return true;
        }
        else {
            return false;
        }
    }


    public function add_user_to_game($game_id, $user_id) {
        $game = $this->query_game($game_id);
        if(!$game){
            error_log("Could not find the game to add user to...");
            return false;
        }

        // Add the user to the next open slot, if available
        if($game->player1_id == null){
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player1_id=? WHERE id=?");
        }
        else if ($game->player2_id == null) {
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player2_id=? WHERE id=?");
        }
        else if ($game->player3_id == null) {
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player3_id=? WHERE id=?");
        }
        else if ($game->player4_id == null) {
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player4_id=? WHERE id=?");
        }
        else {
            error_log("The game is full! Cannot insert user into the current game...");
            return false;
        }

        // Prepare the sql statement
        $stmt->execute(array($user_id, $game_id));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }



    public function remove_user_to_game($game_id, $user_id) {
        $game = $this->query_game($game_id);
        if(!$game){
            error_log("Could not find the game to remove user from...");
            return false;
        }

        // Add the user to the next open slot, if available
        if($game->player1_id == $user_id){
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player1_id=NULL WHERE id=?");
        }
        else if ($game->player2_id == $user_id) {
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player2_id=NULL WHERE id=?");
        }
        else if ($game->player3_id == $user_id) {
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player3_id=NULL WHERE id=?");
        }
        else if ($game->player4_id == $user_id) {
            $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player4_id=NULL WHERE id=?");
        }
        else {
            error_log("The user is not part of the game! Cannot remove user from the game...");
            return false;
        }

        // Prepare the sql statement
        $stmt->execute(array($game_id));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }




    public function end_game($game_id, $user_id) {
        $game = $this->query_game($game_id);
        if(!$game){
            error_log("Could not find the game to remove user from...");
            return false;
        }

        if(!$this->is_user_in_game($game_id, $user_id)){
            error_log("The user is not part of the game! Use cannot end a game he/she is not a part of...");
            return false;
        }


        $stmt = $this->dbh->prepare("UPDATE $this->table_name SET in_progress=0 WHERE id=?");


        // TODO: Eventually, delete all piece records for a finished game, since they are no longer needed


        // Prepare the sql statement
        $stmt->execute(array($game_id));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }















}




?>