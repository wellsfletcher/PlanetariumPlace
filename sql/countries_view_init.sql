
/*
DROP VIEW IF EXISTS country_view;
create view country_view as 
select 
	country.Label as name,
    country.Population as population,
    country.area as area,
    country.GDP as gdp
from country;
    
select * from country_view;

*/

-- set @maxWorth = 6;

/*
DROP VIEW IF EXISTS territory_view; -- (Worth * / max(Worth)) as Price
create view territory_view as 
select 
	A.Label as Name,
    A.Population as Population,
    A.Area as Area,
    A.GDP as GDP, -- GPD per capita
    A.Latitude as Latitude,
    A.Longitude as Longitude,
    (A.Population * A.GDP) as Worth, -- actual GDP
	50 * (
		0.25 * (Population * GDP / (select max(Population * GDP) from country))
	    + 0.74 * (Area / (select max(Area) from country))
        + 0.01
    ) as Price
from country as A
where A.IsIndependent = "Yes";

select * from territory_view;
select SUM(Price) from territory_view;
*/




