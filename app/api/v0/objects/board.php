<?php
class Board {
    // database connection
    private $conn;

    // constructor with $db as database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    function getTiles($boardId) {
        // init the json holder
        $json = $conn->get('myFirstRedisVariableEver');

        // show canvas data in json format
        // $json = json_encode($canvas_dict);
        return $json;
    }
}
?>
