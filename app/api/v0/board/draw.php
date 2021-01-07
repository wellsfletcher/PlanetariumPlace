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

// this file is located at http://planetarium.place/api/v0/board/draw.php

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$board = new Board($db);

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
?>
