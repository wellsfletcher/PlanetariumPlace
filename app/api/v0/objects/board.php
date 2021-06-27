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
        return preg_replace("([^0-9/\- :\.])", "", $str);
    }

    function sanitizeAlphanumeric($str) {
        // return preg_replace("((a-z)|(A-Z)|(0-9))", "", $str);
        // return preg_replace("(a-zA-Z0-9)", "", $str);
        // return intval(filter_var($str, FILTER_SANITIZE_STRING));
        return $str;
    }

    function getWidth($boardId) {
        // santitize boardId first? or check if it exists?
        $widthKey = "width:$boardId";
        // if (!$this->conn->exists($widthKey)) return;
        $width = intval($this->conn->get($widthKey));
        return $width;
    }

    function getHeight($boardId, $width = null) {
        if ($width == null) {
            $width = $this->getWidth($boardId);
        }
        return intdiv($width, 2);
    }

    function getTiles($boardId) {
        // sanitizeDate boardId
        $boardId = $this->sanitizeInteger($boardId); // $boardId = $this->sanitizeAlphanumeric($boardId);
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
        echo "width = $width \n"
        $height = $this->getHeight($boardId, $width);
        echo "$height = $height \n"
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
        $doesKeyExist = $this->conn->exists($tilesKey);
        $isIndexInBounds = $index >= $minIndex && $index < $maxIndex;
        $isColorInBounds = $color >= $minColor && $color < $maxColor;
        if ($doesKeyExist && $isIndexInBounds && $isColorInBounds) {
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
        // echo "boardId = $boardId, since = $since \n";

        // TODO: check to see if board exists first...
        // echo "Hello. ";
        $boardId = $this->sanitizeInteger($boardId);
        $since = $this->sanitizeDate($since);

        $query = "CALL query_recent($boardId, '$since');";
        // echo "query = $query \n";

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

    /*
    private
    *
    function extractHistoryRows($stmt) {
        $historyDict = array();

        // fetch() is faster than fetchAll()
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            echo "$placement_date \n";

            $historyItem=array(
                "id" => $id,
                "width" => $width,
                "height" => $width,
                "placement_date" => $placement_date
            );

            array_push($historyDict, $historyItem);
        }

        return $historyDict;
    }
    */

    function test() {
        // $this->conn->rawCommand("BITFIELD", "tiles:1", "SET", "u4", "#1", 13);
    }
}
?>
