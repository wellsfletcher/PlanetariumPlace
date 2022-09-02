<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
// include_once '../config/database.php';
include_once '../config/sqlDatabase.php';
include_once '../objects/country.php';

// this file is located at http://planetarium.place/api/v0/board/tiles.php

// instantiate database and product object
// $database = new Database(); // I don't think we even need this
// $db = $database->getConnection();
$sqlDatabase = new SqlDatabase();
$sqlDb = $sqlDatabase->getConnection();

/*
$data = json_decode(file_get_contents("php://input"));
// echo file_get_contents("php://input");
// echo "\n";

$wikidataid = $data->wikidataid;
*/

$country = new Country($sqlDb);

// $json = $country->getTerritoryGeometry($wikidataid);
$json = $country->getTerritoryGeometry("Q40");
echo $json;

// $db->close();
// $sqlDb->close();
?>
