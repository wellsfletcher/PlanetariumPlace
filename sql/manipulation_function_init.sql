DROP PROCEDURE IF EXISTS append_tile;
DELIMITER //
CREATE PROCEDURE append_tile(
	IN board_id int,
    IN tile_index int,
    IN color int
)
BEGIN
-- Type solution below

    insert into TileHistory(board_id, tile_index, color, placement_time) VALUES(board_id, tile_index, color, NOW(3));
    -- set @box_id = (select max(id) from Box);

-- End of solution
END //
DELIMITER ;

