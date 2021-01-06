<?php
class Database {
    private $host = "localhost";
    // private $db_name = "myDBName";
    // private $username = "fakeUserName69";
    // private $password = "mnbvcxz123456789mnbvcxz";
    private $port = 6379;
    // private $timeOut = 3.5;
    public $conn;

    // Returns the database connection.
    public function getConnection() {
        $this->conn = null;

        try {
            // $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            // $this->conn->exec("set names utf8");
            $this->conn = new Redis();
            $this->conn->connect($host, $port);
        } catch(Exception $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
