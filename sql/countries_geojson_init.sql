use PlaceDB;

-- load the geojson into the variable
-- SELECT @JSON = BulkColumn FROM OPENROWSET (BULK 'C:\Users\jeremy.lindsay\buildings.geojson', SINGLE_CLOB) as JSON
 -- LOAD DATA LOCAL INFILE '/path/pet.txt' INTO @JSON
 -- SET @geojson = LOAD_FILE('../dump/ne_110m_admim_0_countries_lakes_2021_12_24_header.geojson');
-- SET @geojson = LOAD_FILE('tester.sql');
 
-- use OPENJSON to split the different JSON nodes into separate columns
select @geojson;

/*
SELECT *
 FROM
   JSON_TABLE(
     '[{"a":"3"},{"a":2},{"b":1},{"a":0},{"a":[1,2]}]',
     "$[*]"
     COLUMNS(
      rowid FOR ORDINALITY,
       ac VARCHAR(100) PATH "$.a" DEFAULT '111' ON EMPTY DEFAULT '999' ON ERROR,
       aj JSON PATH "$.a" DEFAULT '{"x": 333}' ON EMPTY,
       bx INT EXISTS PATH "$.b"
	 )
   ) AS countries5;
*/

/*
SELECT
	*
FROM
OPENJSON(@geojson, '$.features')
	WITH (
		BuildingReference nvarchar(300) '$.properties.BuildingReference',
		Address nvarchar(300) '$.properties.Address',
		City nvarchar(300) '$.properties.City',
		Postcode nvarchar(300) '$.properties.Postcode',
		CurrentStatus nvarchar(300) '$.properties.CurrentStatus',
		Longitude nvarchar(300) '$.geometry.coordinates[0]',
		Latitude nvarchar(300) '$.geometry.coordinates[1]'
	)
*/

-- SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
SET @json = '{
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [
                180,
                -16.067133
              ],
              [
                180,
                -16.555217
              ],
              [
                179.364143,
                -16.801354
              ],
              [
                178.725059,
                -17.012042
              ],
              [
                178.596839,
                -16.63915
              ],
              [
                179.096609,
                -16.433984
              ],
              [
                179.413509,
                -16.379054
              ],
              [
                180,
                -16.067133
              ]
            ]
          ],
          [
            [
              [
                178.12557,
                -17.50481
              ],
              [
                178.3736,
                -17.33992
              ],
              [
                178.71806,
                -17.62846
              ],
              [
                178.55271,
                -18.15059
              ],
              [
                177.93266,
                -18.28799
              ],
              [
                177.38146,
                -18.16432
              ],
              [
                177.28504,
                -17.72465
              ],
              [
                177.67087,
                -17.38114
              ],
              [
                178.12557,
                -17.50481
              ]
            ]
          ],
          [
            [
              [
                -179.79332,
                -16.020882
              ],
              [
                -179.917369,
                -16.501783
              ],
              [
                -180,
                -16.555217
              ],
              [
                -180,
                -16.067133
              ],
              [
                -179.79332,
                -16.020882
              ]
            ]
          ]
        ]
      }';
SELECT ST_AsText(ST_GeomFromGeoJSON(@json));