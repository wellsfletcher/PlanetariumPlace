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
        wikidataid,
        bbox, 
        geometry_type, 
        geometry_coordinates 
	from territory
	where LOWER(territory.wikidataid) = LOWER(wikidataid);

-- End of solution
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS get_territory_geometry_from_name;
DELIMITER //
CREATE PROCEDURE get_territory_geometry_from_name(
	name_long VARCHAR(129)
)
BEGIN
-- Type solution below
	
	select 
		name_long, 
        wikidataid,
        bbox, 
        geometry_type, 
        geometry_coordinates 
	from territory
	where LOWER(territory.name_long) = LOWER(name_long);

-- End of solution
END //
DELIMITER ;

call get_territory_geometry_from_name("Ohio");
-- call get_territory_geometry("Q40");