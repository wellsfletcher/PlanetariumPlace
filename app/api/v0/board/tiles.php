<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/board.php';

// this file is located at http://planetarium.place/api/v0/board/tiles.php

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$board = new Board($db);

// query canvas
$boardId = 1;
$json = $board->getTiles($boardId);
echo $json;
$db->close();
?>
