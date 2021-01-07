<?php
class Board {
    // database connection
    private $conn;

    // constructor with $db as database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    function sanitizeInteger($str) {
        return intval(FILTER_SANITIZE_NUMBER_INT($str));
    }

    function getWidth($boardId) {
        return 1024;
    }

    function getHeight($boardId) {
        return 512;
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

    function setTile($boardId, $x, $y, $color) {
        // $boardId = $this->sanitizeInteger($boardId);
        $x = $this->sanitizeInteger($x);
        $y = $this->sanitizeInteger($y);
        $color = $this->sanitizeInteger($color);
        $width = 1024; // $this->getWidth();
        // $height = $this->getHeight();
        // $minIndex = 0;
        // $maxIndex = $height * $width;
        // $minColor = 0;
        // $maxColor = 16;
        // init the json holder
        // $json = $this->conn->get('myFirstRedisVariableEver');
        $tilesKey = "tiles:$boardId";
        // echo "tile key = " . $tilesKey . "\n";

        $index = 0;
        $index = $x + ($width * $y);

        // BITFIELD testBitField SET u4 #(x + (width * y)) color
        // if ($index >= $maxIndex && $index < $maxIndex)
        $offset = $index;
        $this->conn->rawCommand("BITFIELD", $tilesKey, "SET", "u4", $offset, $color);

        // show canvas data in json format
        // $json = json_encode($canvas_dict);
        // return $json;
    }
}
?>
