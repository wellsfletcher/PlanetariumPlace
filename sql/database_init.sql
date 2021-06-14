use PlaceDB;

DROP TABLE IF EXISTS TileHistory;

DROP TABLE IF EXISTS TileHistory;
create table TileHistory (
	id int NOT NULL AUTO_INCREMENT,
    board_id int NOT NULL,
    tile_index int NOT NULL,
	color int NOT NULL,
	placement_time datetime(3) NOT NULL,
	-- placed_by int,
    -- CONSTRAINT tile_fk_1 FOREIGN KEY (placed_by) REFERENCES Users (id),
	PRIMARY KEY (id)
) AUTO_INCREMENT = 0;


