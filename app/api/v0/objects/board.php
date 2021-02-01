<?php
class Board {
    // database connection
    private $conn;

    // constructor with $db as database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    function sanitizeInteger($str) {
        // return intval(FILTER_SANITIZE_NUMBER_INT($str)); // filter_var($number, FILTER_SANITIZE_NUMBER_INT)
        return intval(filter_var($str, FILTER_SANITIZE_NUMBER_INT));
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

        http_response_code(200);
        return $json;
    }

    function setTile($boardId, $x, $y, $color) {
        // TODO: check to see if board exists first...
        // TODO: retrieve width and height of board dynamically (make it not be hardcoded anymore)
        $boardId = $this->sanitizeInteger($boardId);
        $x = $this->sanitizeInteger($x);
        $y = $this->sanitizeInteger($y);
        $color = $this->sanitizeInteger($color);

        $width = $this->getWidth($boardId);
        $height = $this->getHeight($boardId);
        $minIndex = 0;
        $maxIndex = $height * $width;
        $minColor = 0;
        $maxColor = 16;
        // init the json holder
        // $json = $this->conn->get('myFirstRedisVariableEver');
        $tilesKey = "tiles:$boardId";
        // echo "tile key = " . $tilesKey . "\n";

        // $index = 0;
        $index = $x + ($width * $y);

        // BITFIELD testBitField SET u4 #(x + (width * y)) color
        $isIndexInBounds = $index >= $minIndex && $index < $maxIndex;
        $isColorInBounds = $color >= $minColor && $color < $maxColor;
        if ($isIndexInBounds && $isColorInBounds) {
            $offset = $index;
            $this->conn->rawCommand("BITFIELD", $tilesKey, "SET", "u4", "#$offset", $color);
        } else {
            http_response_code(404);
        }

        // show canvas data in json format
        // $json = json_encode($canvas_dict);
        // return $json;
        http_response_code(201);
    }

    function test() {
        // $this->conn->rawCommand("BITFIELD", "tiles:1", "SET", "u4", "#1", 13);
    }
}
?>
