<?php

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

    const PLAYER_1 = 1;
    const PLAYER_2 = 2;
    const PLAYER_3 = 3;
    const PLAYER_4 = 4;

    // Ignore any piece with a value larger than this
    const MAX_PIECE_VALUE = 5;


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
        $stmt = $this->dbh->prepare("INSERT INTO $this->table_name (player1_id, in_progress, player_turn) VALUES (?, 1, 1)");
        $stmt->execute(array($user_id));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }


    /**
        Checks to see if the user is part of the game.
        If so, it will return the player number that the user is.
        If the user is not in the game, it will return false.
    **/
    public function is_user_in_game($game_id, $user_id){
        $game = $this->query_game($game_id);
        if($game->player1_id == $user_id){
            return 1;
        }
        else if($game->player2_id == $user_id) {
            return 2;
        }
        else if($game->player3_id == $user_id) {
            return 3;
        }
        else if($game->player4_id == $user_id) {
            return 4;
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



    /**
        Ends the designated game by setting the in_progress field to 0.
        Checks to make sure the user_id is actually part of the game
    **/
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

        // TODO: Add up score totals now, and save it for future reference?

        // TODO: Save how big the gameboard was (total points possible)


        // Prepare the sql statement
        $stmt->execute(array($game_id));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }



    /**
        Advances the game to the next turn for the designated game
        Checks to make sure the user_id is actually part of the game

        Returns the new player turn if successful, false if it failed to advance the turn
    **/
    public function next_turn($game_id, $user_id) {
        $game = $this->query_game($game_id);
        if(!$game){
            error_log("Could not find the game to advance the turn for...");
            return false;
        }

        if(!$this->is_user_in_game($game_id, $user_id)){
            error_log("The user is not part of the game! Use cannot end a game he/she is not a part of...");
            return false;
        }

        // Advance the player turn
        $new_player_turn = $game->player_turn;
        if($game->player_turn == self::PLAYER_4){
            $new_player_turn = self::PLAYER_1;
        }
        else {
            $new_player_turn++;
        }

        // TODO: keep track of the current turn number and increment it each turn, so I can know what turn the piece was placed
        $stmt = $this->dbh->prepare("UPDATE $this->table_name SET player_turn=$new_player_turn WHERE id=?");

        // Prepare the sql statement
        $stmt->execute(array($game_id));
        if($stmt->rowCount()){
            return $new_player_turn;
        }
        else {
            return false;
        }
    }


    // TODO: Undo last turn function
    public function undo_last_turn() {

        // -Turn back the turn

        // Query the last-placed piece
        // If it exists,
        // -Remove piece

        // -Subtract score


    }







    // // TODO: Record the scores for different pieces
    // public function add_piece_to_score($game_id, $player_number, $score) {

    // }




}




?>