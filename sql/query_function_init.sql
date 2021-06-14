/*
DROP FUNCTION IF EXISTS query_interval;
DELIMITER //
CREATE FUNCTION query_interval(
	board_id int,
	start_time datetime(3),
    end_time datetime(3)
) RETURNS integer
BEGIN
-- Type solution below
	
    set @changes = (
		select * 
		from TileHistory 
		where placement_time >= start_time 
			and placement_time <= end_time
	);
    return @changes;

-- End of solution
END //
DELIMITER ;

DROP FUNCTION IF EXISTS query_recent;
DELIMITER //
CREATE FUNCTION query_recent(
	board_id int,
	start_time datetime(3)
) RETURNS integer
BEGIN
-- Type solution below

    return query_interval(board_id, start_time, NOW(3));

-- End of solution
END //
DELIMITER ;
*/
DROP PROCEDURE IF EXISTS query_interval;
DELIMITER //
CREATE PROCEDURE query_interval(
	board_id int,
	start_time datetime(3),
    end_time datetime(3)
)
BEGIN
-- Type solution below
	
	select * 
	from TileHistory 
	where placement_time >= start_time 
		and placement_time <= end_time;

-- End of solution
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS query_recent;
DELIMITER //
CREATE PROCEDURE query_recent(
	board_id int,
	start_time datetime(3)
)
BEGIN
-- Type solution below

	call query_interval(board_id, start_time, NOW(3));

-- End of solution
END //
DELIMITER ;

DROP FUNCTION IF EXISTS five_seconds_ago;
DELIMITER //
CREATE FUNCTION five_seconds_ago(
) RETURNS datetime(3)
BEGIN
-- Type solution below

    return SUBTIME(NOW(3), "30"); 

-- End of solution
END //
DELIMITER ;

