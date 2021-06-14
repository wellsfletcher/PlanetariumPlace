<?php
class SqlDatabase {
    private $host = "localhost";
    private $db_name = "PlaceDB";
    private $username = "realusername69420";
    private $password = "passwordpasswordpassword";
    public $conn;

    // Returns the database connection.
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
