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
    -- delete rows if the tile history exceeds the maximum amount of rows
    /*
    delete
    from TileHistory
    where id not in (
		select id
        from TileHistory
        order by placement_time DESC
        LIMIT 2048
    );
    */
    delete th1
	from TileHistory as th1
	left outer join (
		select id
		from TileHistory
		order by placement_time DESC
		LIMIT 2048
	) as th2
	on th1.id = th2.id
	where th2.id is null;

-- End of solution
END //
DELIMITER ;

