<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

class Country {
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

    function getCountries() {
        /*
        // $this->sqlConn->
        $result = mysqli_query($this->sqlConn, "SELECT * FROM territory_view;");
        $rows = array();

        while ($row = mysqli_fetch_assoc($result)) { // mysql_fetch_row
            $rows[] = $row;
        }

        return json_encode($rows);
        */
        $query = "SELECT * FROM territory_view;";

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
