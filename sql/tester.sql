
select NOW(3);
select SUBTIME("10:24:21.125", ".2"); 

call append_tile(1,  512, 4);

select * from TileHistory;

-- select query_recent( NOW );
# I'm gonna have to just call the contents of this query from the php most likely... or modify the procedure to only select what is needed
call query_recent(1, five_seconds_ago());