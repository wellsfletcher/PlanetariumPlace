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
        // $json = $this->conn->get('myFirstRedisVariableEver');
        $tilesKey = "tiles:$boardId";
        // echo "tile key = " . $tilesKey . "\n";
        $json = $this->conn->get($tilesKey);

        // show canvas data in json format
        // $json = json_encode($canvas_dict);
        return $json;
    }
}
?>
