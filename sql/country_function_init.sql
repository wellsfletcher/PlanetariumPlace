use PlaceDB;

DROP PROCEDURE IF EXISTS get_territory_geometry;
DELIMITER //
CREATE PROCEDURE get_territory_geometry(
	-- name_long VARCHAR(129)
    wikidataid VARCHAR(129)
)
BEGIN
-- Type solution below
	
	select 
		name_long, 
        bbox, 
        geometry_type, 
        geometry_coordinates 
	from territory
	where LOWER(territory.wikidataid) = LOWER(wikidataid);

-- End of solution
END //
DELIMITER ;

-- call get_territory_geometry("Ohio");
call get_territory_geometry("Q40");