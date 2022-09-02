use PlaceDB;


-- woe_id, wiki, fips, gn_id, diss_me, adm1_code
-- (you can also use multiple ids lol)
-- SELECT * FROM country JOIN state ON country.woe_id = state.woe_id;
/*
SELECT * FROM country
LEFT JOIN state ON country.name_long = state.name
UNION
SELECT * FROM country
RIGHT JOIN state ON country.name_long = state.name;
*/
/*
SELECT * FROM country
UNION
SELECT * FROM state;
*/

/*
SELECT * FROM country
 JOIN state ON country.postal = state.postal;
 
SELECT * FROM country
LEFT JOIN state ON country.woe_id = state.woe_id;

SELECT * FROM country
UNION ALL
SELECT * FROM state;

DROP VIEW IF EXISTS territory_view;
create view territory_view as 
SELECT * FROM country
LEFT JOIN state ON country.woe_id = state.woe_id
UNION
SELECT * FROM country
RIGHT JOIN state ON country.woe_id = state.woe_id;

SELECT *
FROM territory_view T1, territory_view T2
WHERE T1.woe_id = T2.woe_id;
*/

-- start by trying to merge the two tables with hardcoded columns
-- important columns are name, woe_id, pop_est, gdp_md -- RIP it doesn't have population or gdp
-- we'll start with name, woe_id, wikidataid instead
-- less important ones are wikidataid, bbox, geometry_type, geometry_coordinates, label_x, label_y
-- select * from country;
-- select * from state;

/*
SELECT name, woe_id, wikidataid FROM country
UNION
SELECT name, woe_id, wikidataid FROM state;


select (SELECT COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'country' LIMIT 1) from country;
select (SELECT group_concat(COLUMN_NAME)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'country') from country;


SELECT COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'country' LIMIT 1;
SELECT group_concat(COLUMN_NAME)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'country';
SELECT COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'country';
SHOW COLUMNS FROM country;
*/

/*
SELECT COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'country'
UNION
SELECT COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'state';
  */


-- SET @colname = 'name';
SET SESSION group_concat_max_len=2048;

SET @tableA = 'country';
-- SET @tableB = 'state';
SET @tableB = 'us_state';
/*
SELECT group_concat(COLUMN_NAME)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = 'country'
  INTO @colname;
*/
SELECT group_concat(COLUMN_NAME) from (
	SELECT COLUMN_NAME 
	  FROM INFORMATION_SCHEMA.COLUMNS
	  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = @tableA 
	and COLUMN_NAME in (
	SELECT COLUMN_NAME
	  FROM INFORMATION_SCHEMA.COLUMNS
	  WHERE TABLE_SCHEMA = 'PlaceDB' AND TABLE_NAME = @tableB
	) 
) as commoncolname into @colname;
-- select @colname;
/*
SET @table = 'country';
SET @query = CONCAT('SELECT ', @colname, ' FROM ', @table);
*/
DROP VIEW IF EXISTS all_territory_view;
SET @query = CONCAT('create view all_territory_view as ', 
'SELECT ', @colname, ' FROM ', @tableA,
' UNION ', 
'SELECT ', @colname, ' FROM ', @tableB);
-- 'UNION', 'SELECT ', @colname, ' FROM ', @tableB

PREPARE stmt FROM @query;
EXECUTE stmt;

-- select * from all_territory_view;

-- will also need to remove the united states from here
-- also I really need to add an area column
-- price is suppose to capture demand so I really, and the size of the country is proportional to the demand
-- but there's also a coolness factor I need to measure somehow 
-- something like how many english speakers or internet users are from that country
-- I would need more data if I wanted to do that, and it would be problematic if I scaled price depending on continent
-- so gdp and population are good indicators, but I just need to normalize them appropriately
--  ***** for a much more accurate price, I would need to get the number of pixels that country covers *****
DROP VIEW IF EXISTS territory;
create view territory as
select *,
	1000 * (
		-- 0.99 * ((pop_est * gdp_md) / (select max(pop_est * gdp_md) from all_territory_view))
		-- 0.99 * ((pop_est + gdp_md) / (select max(pop_est + gdp_md) from all_territory_view))
		-- 0.25 * ((pop_est + gdp_md) / (select max(pop_est + gdp_md) from all_territory_view))
        -- 0.125 * ((pop_est) / (select max(pop_est) from all_territory_view))
        -- + 0.125 * ((gdp_md) / (select max(gdp_md) from all_territory_view))
        0.25 * (
			0.3 * ((pop_est) / (select max(pop_est) from all_territory_view))
            + 0.7 * ((gdp_md) / (select max(gdp_md) from all_territory_view))
        )
	    + 0.745 * (area / (select max(area) from all_territory_view))
        -- + 0.745 * (area * sqrt(sqrt(greatest(abs(label_y), 1))) / (select max(area * sqrt(sqrt(greatest(abs(label_y), 1)))) from all_territory_view))
        + 0.005
    ) as price
from all_territory_view;

select sum(price) from territory;
select * from territory;

DROP VIEW IF EXISTS territory_view;
create view territory_view as
select name_long, adm0_a3, wikidataid, pop_est, gdp_md, price from territory;
select * from territory_view;

