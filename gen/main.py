import fiona
from shapely.geometry import shape
from shapely.geometry import Polygon
import matplotlib.pyplot as plt
import geopandas as gpd
import numpy as np
from PIL import Image


pathToCountries = "shapefile/lo-res-countries.shp"

def createBoxPoints(origin, width, height):
    x, y = origin
    cursorPoints = [origin, (x + 0, y + height), (x + width, y + height), (x + width, y + 0)]
    return cursorPoints

def createPolygonBox(origin, width, height):
    return Polygon(createBoxPoints(origin, width, height))

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
    @a the main polygon
    @b the other polygons
    """
    maxArea = 0
    totalArea = 0
    args = (None)
    for j, b in enumerate(bs):
        if a.intersects(b):
            area = (a.intersection(b).area/a.area)
            totalArea += area
            if (area > maxArea):
                maxArea = area
                args = (j)

    return (totalArea, args[0], maxArea)

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

    # 30
    #- cursorWidth = 0.5
    #- cursorHeight = -0.5
    # origin = (0, 0)
    # cursor = createPolygonBox(cursorWidth, cursorHeight, origin)
    # for y in range(90, -90, -cursorHeight):
    print(str(np.linspace(90, -90, 60, endpoint=False, retstep=True)))
    yValues, cursorHeight = np.linspace(90, -90, 512, endpoint=False, retstep=True) # note cursorHeight is negative in this case
    xValues, cursorWidth = np.linspace(-180, 180, 1024, endpoint=False, retstep=True)
    for y in yValues: # np.linspace(90, -90, 60, endpoint=False):
        row = []
        # for x in range(-180, 180, cursorWidth):
        for x in xValues: # np.linspace(-180, 180, 120, endpoint=False):
            color = 0
            origin = (x, y)
            cursor = createPolygonBox(origin, cursorWidth, cursorHeight)
            temp, maxIndex, maxArea = findLargestIntersection([cursor], polygons)
            if maxArea > waterTolerance:
                color = 255

            # result += color
            # result.append(color)
            row.append(color)
        result.append(row)

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
    polygons = fiona.open(pathToCountries)
    polygonsX = [ shape(feat["geometry"]) for feat in polygons ]
    bitmap = pixelate(polygonsX)
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
