
select NOW(3);
select SUBTIME("10:24:21.125", ".2"); 

call append_tile(1,  512, 4);

select * from TileHistory;
select count(*) from TileHistory;

-- select query_recent( NOW );
# I'm gonna have to just call the contents of this query from the php most likely... or modify the procedure to only select what is needed
call query_recent(1, five_seconds_ago());

CALL query_recent("1", "2021-06-14");


/*
delete 
from TileHistory
where id not in (
	select id
	from TileHistory
	order by placement_time DESC
	LIMIT 30
);
*/

/*
select * 
from TileHistory as th1
inner join (
	select id
	from TileHistory
	order by placement_time DESC
	LIMIT 30
) as th2
on th1.id = th2.id;
*/

/* --
delete th1
from TileHistory as th1
left outer join (
	select id
	from TileHistory
	order by placement_time DESC
	LIMIT 30
) as th2
on th1.id = th2.id
where th2.id is null;
*/


