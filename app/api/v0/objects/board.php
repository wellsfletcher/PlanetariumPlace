<?php
class Board {
    // database connection
    private $conn;
    // sql database connection
    private $sqlConn;

    // constructor with $db as database connection
    public function __construct($db, $sqlDb = null) {
        // public function __construct($db) {
        $this->conn = $db;
        $this->sqlConn = $sqlDb;
    }

    function sanitizeInteger($str) {
        // return intval(FILTER_SANITIZE_NUMBER_INT($str)); // filter_var($number, FILTER_SANITIZE_NUMBER_INT)
        return intval(filter_var($str, FILTER_SANITIZE_NUMBER_INT));
    }

    function sanitizeDate($str) {
        return $str;
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
        // echo "Hello. ";
        // echo "$x, $y, color = $color, boardId = $boardId \n";
        $boardId = $this->sanitizeInteger($boardId);
        $x = $this->sanitizeInteger($x);
        $y = $this->sanitizeInteger($y);
        $color = $this->sanitizeInteger($color);

        // echo "Hello there. ";
        // echo "$x, $y, color = $color, boardId = $boardId \n";

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

            $this->appendToTileHistory($boardId, $index, $color);
            http_response_code(201);
        } else {
            http_response_code(404);
        }

        // show canvas data in json format
        // $json = json_encode($canvas_dict);
        // return $json;
        // http_response_code(201);
    }

    /*
    function buildAppendTileQuery($boardId, $index, $color) {
        $query = "CALL append_tile($boardId, $index, $color);";
        return $query;
    }
    */

    function appendToTileHistory($boardId, $index, $color) {
        $query = "CALL append_tile($boardId, $index, $color);";

        // prepare query statement
        $stmt = $this->sqlConn->prepare($query);

        // execute the query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getRecentHistory($boardId, $since) {
        // TODO: check to see if board exists first...
        // echo "Hello. ";
        $boardId = $this->sanitizeInteger($boardId);
        $since = $this->sanitizeDate($since);

        /*
        // init the json dictionary
        $historyDict = array();
        $historyDict["info"] = null;
        $historyDict["children"] = array();
        */

        $query = "CALL query_recent($boardId, $since);";

        // prepare query statement
        $stmt = $this->sqlConn->prepare($query);

        // execute the query
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $historyDict = $result;

        // show canvas data in json format
        $json = json_encode($historyDict);
        return $json;
    }

    function test() {
        // $this->conn->rawCommand("BITFIELD", "tiles:1", "SET", "u4", "#1", 13);
    }
}
?>
