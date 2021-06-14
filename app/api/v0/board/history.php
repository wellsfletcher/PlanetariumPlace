<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../config/sqlDatabase.php';
include_once '../objects/board.php';

// this file is located at http://planetarium.place/api/v0/board/tiles.php

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
$sqlDatabase = new SqlDatabase();
$sqlDb = $sqlDatabase->getConnection();

// initialize object
$board = new Board($db, $sqlDb);

// get input parameters
$data = json_decode(file_get_contents("php://input"));
echo $data;
echo "\n";

$boardId = $data->boardId;
$since = $data->since;

// query canvas
$json = $board->getRecentHistory($boardId, $since);
echo $json;
$db->close();
// $sqlDb->close();
?>
