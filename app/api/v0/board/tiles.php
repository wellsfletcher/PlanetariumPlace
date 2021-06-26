<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/board.php';

// this file is located at http://planetarium.place/api/v0/board/tiles.php

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// fetch data input data
$boardId = 1;
$data = json_decode(file_get_contents("php://input"));
$boardId = $data->boardId;
/*
if (isset($data) && isset($data->boardId)) {
    $boardId = $data->boardId;
}
*/


// initialize object
$board = new Board($db);

// query canvas
$json = $board->getTiles($boardId);
echo $json;
$db->close();
?>
