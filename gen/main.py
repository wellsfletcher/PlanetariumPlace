import fiona
from shapely.geometry import shape
from shapely.geometry import Polygon
import matplotlib.pyplot as plt
import geopandas as gpd
import numpy as np
from PIL import Image


# pathToCountries = "shapefile/lo-res-countries.shp"
pathToCountries = "shapefile/mid-res-land.shp"

def createBoxPoints(origin, width, height):
    x, y = origin
    cursorPoints = [origin, (x + 0, y + height), (x + width, y + height), (x + width, y + 0)]
    return cursorPoints

def createPolygonBox(origin, width, height):
    return Polygon(createBoxPoints(origin, width, height))

def getIntersections(a, bs):
    result = []
    for j, b in enumerate(bs):
        # print(b)
        if a.intersects(b):
            result.append(b)

    return result

def findLargestIntersection(a, b):
    """
    @a the first polygon
    @b the second polygon
    """
    maxArea = 0
    args = (None, None)
    for i, aa in enumerate(a):
        for j, bb in enumerate(b):
            if aa.intersects(bb):
                area = (aa.intersection(bb).area/aa.area)
                if (area > maxArea):
                    maxArea = area
                    args = (i, j)

    return (args[0], args[1], maxArea)

def findTotalIntersection(a, bs):
    """
    In the context of this file, is used to find the percent area of a pixel that is covered by land, where bs is the
    list of countries represented by polygons.
    @a the main polygon
    @b the other polygons
    """
    maxArea = 0
    totalArea = 0
    args = None
    for j, b in enumerate(bs):
        if a.intersects(b):
            area = (a.intersection(b).area/a.area)
            totalArea += area
            if (area > maxArea):
                maxArea = area
                args = j

    return (totalArea, args, maxArea)

def pixelate(polygons):
    """
    Pixelates a map.
    @polygons list of polygons representing the land
    @return a list of lists representing the a bitmask of land.
    """
    result = []

    # waterTolerance = 0.125
    # waterTolerance = 0.25
    waterTolerance = 0.1875
    waterTolerance = 0.15
    waterTolerance = 0.2

    # 30
    #- cursorWidth = 0.5
    #- cursorHeight = -0.5
    # origin = (0, 0)
    # cursor = createPolygonBox(cursorWidth, cursorHeight, origin)
    # for y in range(90, -90, -cursorHeight):
    print(str(np.linspace(90, -90, 60, endpoint=False, retstep=True)))
    yValues, cursorHeight = np.linspace(90, -90, 64, endpoint=False, retstep=True) # note cursorHeight is negative in this case
    xValues, cursorWidth = np.linspace(-180, 180, 128, endpoint=False, retstep=True)
    for y in yValues: # np.linspace(90, -90, 60, endpoint=False):
        row = []
        # for x in range(-180, 180, cursorWidth):
        for x in xValues: # np.linspace(-180, 180, 120, endpoint=False):
            color = 0
            origin = (x, y)
            cursor = createPolygonBox(origin, cursorWidth, cursorHeight)
            # temp, maxIndex, maxArea = findLargestIntersection([cursor], polygons)
            totalArea, maxIndex, maxArea = findTotalIntersection(cursor, polygons)
            if totalArea > waterTolerance:
                color = 255

            # result += color
            # result.append(color)
            row.append(color)
        result.append(row)

    return result

def quickFindTotalIntersection(a, bs):
    """
    This version does not check if the given polygons intersect before performing the main calculation.
    @a the main polygon
    @b the other polygons
    """
    maxArea = 0
    totalArea = 0
    args = None
    for j, b in enumerate(bs):
        area = (a.intersection(b).area/a.area)
        totalArea += area
        if (area > maxArea):
            maxArea = area
            args = j

    return (totalArea, args, maxArea)

def intersectsGrid(polygons, subgridOrigin, subgridWidth, subgridHeight, cursorOrigin, cursorWidth, cursorHeight):
    """
    I think I am doing this as a way to quickly find what polygons (which are really countries in this case) intersect a pixel
    @return [[Polygon]] a 2D grid where each cell represents the polygons that intersect with that cell.
    """
    rows = subgridHeight
    columns = subgridWidth
    grid = []
    for r in range(rows):
        row = []
        for c in range(columns):
            row.append([])
        grid.append(row)

    return intersectsGridHelper(grid, polygons, subgridOrigin, subgridWidth, subgridHeight, cursorOrigin, cursorWidth, cursorHeight)

def intersectsGridHelper(grid, polygons, subgridOrigin, subgridWidth, subgridHeight, cursorOrigin, cursorWidth, cursorHeight):
    """
    @return [[Polygon]] a 2D grid where each cell represents the polygons that intersect with that cell.
    """
    result = grid
    # cursorWidth = geoWidth
    # cursorHeight = geoHeight
    subgridOriginX, subgridOriginY = subgridOrigin
    cursorOriginX, cursorOriginY = cursorOrigin
    geoOrigin = (subgridOriginX * cursorWidth + cursorOriginX, subgridOriginY * -cursorHeight + cursorOriginY)
    geoWidth = subgridWidth * cursorWidth
    geoHeight = subgridHeight * -cursorHeight

    cursor = createPolygonBox(geoOrigin, geoWidth, geoHeight)
    intersectingPolygons = getIntersections(cursor, polygons)

    """print("subgridOrigin = " + str(subgridOrigin))
    print("subgridWidth = " + str(subgridWidth))
    print("subgridHeight = " + str(subgridHeight))
    print("geoOrigin = " + str(geoOrigin))
    print("geoWidth = " + str(geoWidth))
    print("geoHeight = " + str(geoHeight))
    print("intersectingPolygons = " + str(intersectingPolygons))"""


    if subgridWidth == 1 or subgridHeight == 1:
        if subgridWidth == 1 and subgridHeight == 1:
            grid[subgridOriginY][subgridOriginX] = intersectingPolygons
        else:
            subsubgridWidth = subgridWidth
            subsubgridHeight = subgridHeight
            if subgridWidth == 1: # subgridHeight == 2
                pass
                subsubgridHeight = 1
                # BL
                subsubGridOrigin = (subgridOriginX + 0, subgridOriginY + subsubgridHeight)
                grid = intersectsGridHelper(grid, intersectingPolygons, subsubGridOrigin, subsubgridWidth,
                                            subsubgridHeight,
                                            cursorOrigin, cursorWidth, cursorHeight)
            else: # subgridWidth == 2
                pass # this is the one I will encounter
                subsubgridWidth = 1
                # TR
                subsubGridOrigin = (subgridOriginX + subsubgridWidth, subgridOriginY + 0)
                grid = intersectsGridHelper(grid, intersectingPolygons, subsubGridOrigin, subsubgridWidth,
                                            subsubgridHeight,
                                            cursorOrigin, cursorWidth, cursorHeight)

            # TL
            subsubGridOrigin = subgridOrigin
            grid = intersectsGridHelper(grid, intersectingPolygons, subsubGridOrigin, subsubgridWidth,
                                        subsubgridHeight,
                                        cursorOrigin, cursorWidth, cursorHeight)
    else:
        subsubgridWidth = subgridWidth // 2
        subsubgridHeight = subgridHeight // 2
        # TL
        subsubGridOrigin = subgridOrigin
        grid = intersectsGridHelper(grid, intersectingPolygons, subsubGridOrigin, subsubgridWidth, subsubgridHeight,
                                    cursorOrigin, cursorWidth, cursorHeight)
        # if subgridWidth >= 1:
        # TR
        subsubGridOrigin = (subgridOriginX + subsubgridWidth, subgridOriginY + 0)
        grid = intersectsGridHelper(grid, intersectingPolygons, subsubGridOrigin, subsubgridWidth, subsubgridHeight,
                                    cursorOrigin, cursorWidth, cursorHeight)
        # if subgridHeight >= 1:
        # BL
        subsubGridOrigin = (subgridOriginX + 0, subgridOriginY + subsubgridHeight)
        grid = intersectsGridHelper(grid, intersectingPolygons, subsubGridOrigin, subsubgridWidth, subsubgridHeight,
                                    cursorOrigin, cursorWidth, cursorHeight)
        # if subgridWidth > 1 and subgridHeight > 1:
        # BR
        subsubGridOrigin = (subgridOriginX + subsubgridWidth, subgridOriginY + subsubgridHeight)
        grid = intersectsGridHelper(grid, intersectingPolygons, subsubGridOrigin, subsubgridWidth, subsubgridHeight,
                                    cursorOrigin, cursorWidth, cursorHeight)

    return grid

def quickPixelate(polygons):
    """
    Pixelates a map. This version only works with base 2 grid sizes.
    @polygons list of polygons representing the land
    @return a list of lists representing the a bitmask of land.
    """
    result = []

    # waterTolerance = 0.125
    # waterTolerance = 0.25
    waterTolerance = 0.1875
    waterTolerance = 0.15
    waterTolerance = 0.2

    # 30
    #- cursorWidth = 0.5
    #- cursorHeight = -0.5
    # origin = (0, 0)
    # cursor = createPolygonBox(cursorWidth, cursorHeight, origin)
    # for y in range(90, -90, -cursorHeight):
    print(str(np.linspace(90, -90, 60, endpoint=False, retstep=True)))
    yValues, cursorHeight = np.linspace(90, -90, 512, endpoint=False, retstep=True) # note cursorHeight is negative in this case
    xValues, cursorWidth = np.linspace(-180, 180, 1024, endpoint=False, retstep=True)

    subgridOrigin = (0, 0)
    subgridWidth = len(xValues)
    subgridHeight = len(yValues)
    cursorOrigin = (-180, 90)
    gridIntersections = intersectsGrid(polygons, subgridOrigin, subgridWidth, subgridHeight, cursorOrigin, cursorWidth, -cursorHeight)
    # print("gridIntersections = " + str(gridIntersections))
    print("intersections calculated")

    r = 0
    for y in yValues: # np.linspace(90, -90, 60, endpoint=False):
        row = []
        c = 0
        # for x in range(-180, 180, cursorWidth):
        for x in xValues: # np.linspace(-180, 180, 120, endpoint=False):
            color = 0
            origin = (x, y)
            cursor = createPolygonBox(origin, cursorWidth, cursorHeight)
            # (pretty sure) the polygons that intersect with the current pixel
            intersectingPolygons = gridIntersections[r][c]
            # temp, maxIndex, maxArea = findLargestIntersection([cursor], polygons)
            # I think maxIndex might be the index of the polygon (or country) that is contained in the pixel the most
            totalArea, maxIndex, maxArea = quickFindTotalIntersection(cursor, intersectingPolygons)
            if totalArea > waterTolerance:
                color = 255

            # result += color
            # result.append(color)
            row.append(color)
            c += 1
        result.append(row)
        r += 1

    return result

def hidePlotWhitespace(plt):
    size = (1, 1)
    fig = plt.figure()
    # fig.set_size_inches(size)
    ax = plt.Axes(fig, [0., 0., 1., 1.])
    ax.set_axis_off()
    fig.add_axes(ax)
    return fig

def saveBitmap(bitmap, path):
    rows = len(bitmap)
    columns = len(bitmap[0])
    print(str(rows) + "x" + str(columns))

    fig = hidePlotWhitespace(plt)
    size = (1, columns / rows)
    fig.set_size_inches(size)

    plt.imshow(bitmap, interpolation='nearest',  cmap="gray")
    plt.savefig(path, bbox_inches='tight', pad_inches = 0, dpi = rows * 2)
    # plt.show()

def replaceColor(inputPath, outputPath, originalColor, replacementColor):
    # orig_color = (255, 255, 255)
    # replacement_color = (128, 128, 0)
    img = Image.open(inputPath).convert('RGB')
    data = np.array(img)
    data[(data == originalColor).all(axis=-1)] = replacementColor
    img2 = Image.fromarray(data, mode='RGB')
    # img2.show()
    img2.save(outputPath)

def main():
    polygons: [fiona.model.Feature] = fiona.open(pathToCountries)
    polygonsX = [ shape(feat["geometry"]) for feat in polygons ]

    # print("Printing polygons...")
    # print(polygons)
    # for feat in polygons:
        # print(feat)
        # dir(feat)
        # print(feat.keys())
        # print(feat["properties"])
    # dir(polygons)
    # print("Done printing polygons...")

    # bitmap = pixelate(polygonsX)
    bitmap = quickPixelate(polygonsX)
    # print(bitmap)

    white = (255, 255, 255)
    black = (0, 0, 0)

    lightBlack = (27, 27, 27)
    gray = (136, 136, 136)
    lightGray = (228, 228, 228)

    bitmatOutputPath = 'output/pixel-countries.png'
    finalOutputPath = 'output/pixel-countries-2.png'
    saveBitmap(bitmap, bitmatOutputPath)
    replaceColor(bitmatOutputPath, finalOutputPath, white, gray)
    replaceColor(finalOutputPath, finalOutputPath, black, lightBlack)

def main3():
    shapefile = gpd.read_file(pathToCountries)
    shapefile.plot()


    polygon1 = fiona.open(pathToCountries)
    polygon8 = fiona.open(pathToCountries)

    cursorWidth = 30
    cursorHeight = 25
    cursorOrigin = (-100, 0)
    cursorPoints = createBoxPoints(origin, cursorWidth, cursorHeight)
    cursorShape = Polygon(cursorPoints)

    # geom_p1 = [ shape(feat["geometry"]) for feat in polygon1 ]
    geom_p1 = [cursorShape]
    geom_p8 = [ shape(feat["geometry"]) for feat in polygon8 ]

    for i, g1 in enumerate(geom_p1):
        for j, g8 in enumerate(geom_p8):
            if g1.intersects(g8):
                percentArea = (g1.intersection(g8).area/g1.area)
                print(i, j, percentArea, g8.centroid)


main()
