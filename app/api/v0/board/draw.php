<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// header("Access-Control-Allow-Methods: POST");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header("Access-Control-Max-Age: 3600");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// include database and object files
include_once '../config/database.php';
include_once '../config/sqlDatabase.php';
include_once '../objects/board.php';

// this file is located at http://planetarium.place/api/v0/board/draw.php

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
$sqlDatabase = new SqlDatabase();
$sqlDb = $sqlDatabase->getConnection();

// initialize object
// $board = new Board($db);
$board = new Board($db, $sqlDb);
// $board->test();

// get input parameters
$data = json_decode(file_get_contents("php://input"));

$boardId = $data->boardId;
$x = $data->x;
$y = $data->y;
// $width = $board->getWidth();
$color = $data->color;

// query canvas
$board->setTile($boardId, $x, $y, $color);
// echo $json;
$db->close();
// $sqlDb->close();
?>
