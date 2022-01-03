
DROP FUNCTION IF EXISTS maxWorth;
DELIMITER //
CREATE FUNCTION maxWorth(
    canvas_id varchar(40)
) RETURNS integer
BEGIN
-- Type solution below
	
	select Tile.box_id 
    into @tile_box_id
    from Canvas 
    join Tile
    on Canvas.box_id = canvas_id
    and Tile.canvas_id = canvas_id
    and Tile.id = tile_id;
    
    return @tile_box_id;

-- End of solution
END //
DELIMITER ;