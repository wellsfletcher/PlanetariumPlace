


select * from country1;
select * from country2;
select * from country3;
select * from location;

DROP TABLE IF EXISTS country3;
create table country3 as
select 
	A.*,
    B.Longitude,
    B.Latitude
from country2 as A
join location as B
	on A.Label = B.Label
;

DROP TABLE IF EXISTS country;
-- create table country as
select * 
from country1 as A
join country3 as B
	on A.Label = B.Label
; 

select * 
from country1 as A
right join country3 as B
	on A.Label = B.Label
; 

select * 
from country1 as A
left join country3 as B
	on A.Label = B.Label
union
select * 
from country1 as A
right join country3 as B
	on A.Label = B.Label
; 


select * 
from country1 as A
left join country3 as B
	on A.Label = B.Label
    where B.IsIndependent = "Yes"
union
select * 
from country1 as A
right join country3 as B
	on A.Label = B.Label
    where B.IsIndependent = "Yes"
; 

/*
DROP TABLE IF EXISTS country;
select * 
into country 
from country1 as A
join country2 as B
	on A.Label = B.Label
; 
*/


-- DROP TABLE IF EXISTS territory;
