<?php

class Piece {
    // These properties need to match the db fields exactly
    public $id;
    public $game_id;
    public $rows;
    public $cols;
    public $bitmap;
    public $gameboard_x;
    public $gameboard_y;
    public $player_number;
    public $value;
    public $html_piece_id;
    public $html_piece_rotate_id;
}

class Pieces {
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
        $this->table_name = "pieces";
        $this->dbh = new PDO("mysql:host=$this->hostname;dbname=$this->db_name", $this->db_user, $this->db_password);
   }


    /**
        Returns the piece record for the passed piece id.
    **/
    public function query_piece($piece_id) {
        $stmt = $this->dbh->prepare("SELECT * FROM $this->table_name WHERE id = ?");
        $stmt->execute(array($piece_id));
        $stmt->setFetchMode(PDO::FETCH_INTO, new Piece);
        $returned_pieces = $stmt->fetchAll();
        return $returned_pieces[0];
    }



    /**
        Creates a piece

        Returns true if creation was successful, else returns false.
        // TODO: Keep track of turn number
    **/
    public function create_piece($game_id, $rows, $cols, $bitmap, $gameboard_x, $gameboard_y, $player_number, $value, $html_piece_id, $html_piece_rotate_id = null) {
        // Check to make sure the piece had not already been placed for the player for that game
        if($this->has_piece_been_played($game_id, $player_number, $html_piece_id)){
            error_log("ERROR: Piece has already been used!!!! Something is fishy here...");
            return false;
        };

        // Prepare the sql statement
        $stmt = $this->dbh->prepare("INSERT INTO $this->table_name (game_id, rows, cols, bitmap, gameboard_x, gameboard_y, player_number, value, html_piece_id, html_piece_rotate_id) VALUES (:game_id, :rows, :cols, :bitmap, :gameboard_x, :gameboard_y, :player_number, :value, :html_piece_id, :html_piece_rotate_id)");


        $stmt->execute(array(":game_id" => $game_id, ":rows" => $rows, ":cols" => $cols, ":bitmap" => $bitmap, ":gameboard_x" => $gameboard_x, ":gameboard_y" => $gameboard_y, ":player_number" => $player_number, ":value" => $value, ":html_piece_id" => $html_piece_id, ":html_piece_rotate_id" => $html_piece_rotate_id));
        if($stmt->rowCount()){
            return true;
        }
        else {
            return false;
        }
    }


    /**
        Returns true if the player in the game has already used the piece. Returns false if it hasn't been used yet (and is ok to place).
    **/
    public function has_piece_been_played($game_id, $player_number, $html_piece_id) {
        // Prepare the sql statement
        $stmt = $this->dbh->prepare("SELECT id FROM $this->table_name WHERE game_id = ? AND player_number = ? AND html_piece_id = ?");
        $stmt->execute(array($game_id, $player_number, $html_piece_id));
        $stmt->setFetchMode(PDO::FETCH_INTO, new Piece);
        $returned_pieces = $stmt->fetchAll();
        if(count($returned_pieces)){
            error_log(print_r($returned_pieces,1));
            return true;
        }
        else {
            return false;
        }
    }


    // Returns an array of piece records for the current game
    public function get_all_pieces_for_a_game($game_id){
        $stmt = $this->dbh->prepare("SELECT * FROM $this->table_name WHERE game_id = ?");
        $stmt->execute(array($game_id));
        // FETCH_INTO will place the data into an instance of the passed class
        $returned_pieces = [];
        for ($i = 0; $i < $stmt->rowCount(); $i++) {
            $row = new Piece;
            $stmt->setFetchMode(PDO::FETCH_INTO, $row);
            $returned_pieces[] = $stmt->fetch();
        }
        return $returned_pieces;
    }



    // TODO: Implement these functions:

    // public function get_all_pieces_for_player_number

    // delete piece

    // remove last piece (for undo)



}




?>