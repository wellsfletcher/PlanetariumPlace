# import fiona
# from shapely.geometry import shape
# from shapely.geometry import Polygon
import matplotlib.pyplot as plt
# import geopandas as gpd
import numpy as np
from PIL import Image
import redis

pathToBitmap = "../assets/pixel-countries-mid-res-bitmap.png"

def index2vector(index, width):
    x = index % width
    y = (index - x) // width
    return (x, y)

def vector2index(vector, width):
    x, y = vector
    index = (y * width) + x
    return index

def showBitmap(bitmap):
    rows = len(bitmap)
    # columns = len(bitmap[0])

    plt.imshow(bitmap, interpolation='nearest',  cmap="gray")
    plt.show()

def buffer2mat(buffer, width):
    """
    @returns 2D array created from 1D image buffer
    """
    result = []
    length = len(buffer)
    height = length // width
    for r in range(height):
        row = []
        for c in range(width):
            row.append(0)
        result.append(row)

    k = 0
    for color in buffer:
        x, y = index2vector(k, width)
        result[y][x] = color

        k += 1

    return result

def image2bitmap(path):
    img = Image.open(path)
    rgbBuffer = list(img.getdata())
    # print(len(result))

    buffer = []
    for rgba in rgbBuffer:
        color = 1
        r, g, b, a = rgba
        if r == 0 and g == 0 and b == 0:
            color = 0
            # print("there be a 0")
        else:
            pass
        ''' if ~(r == 0 and b == 0 and g == 0):
            color = 1
        else:
            print("there be a 0")'''
        buffer.append(color)

    width, height = img.size

    result = buffer2mat(buffer, width)

    return result

def colorBitmap(bitmap, primaryColor = 1, backgroundColor = 0):
    result = []
    rows = len(bitmap)
    columns = len(bitmap[0])
    for r in range(rows):
        row = []
        for c in range(columns):
            oldColor = bitmap[r][c]
            newColor = backgroundColor
            if oldColor == 1:
                newColor = primaryColor
            row.append(newColor)
        result.append(row)

    return result

def dbDraw(db, coordinate, color, width = 1024, boardId = 1):
    # print(coordinate)
    x, y = coordinate

    # BITFIELD tiles:board_id SET u4 #((x + 0) + (width * (y + 0))) color
    # $this->conn->rawCommand("BITFIELD", $tilesKey, "SET", "u4", "#$offset", $color);
    key = "tiles:" + str(boardId)
    bf = db.bitfield(key)
    index = vector2index(coordinate, width)
    offset = "#" + str(index)

    response = (bf
                .set('u4', offset, color)
                .execute())

    print("response = " + str(response))




def dbDrawHorizontalLine(db, y, width, color = 5):
    boardId = 1
    limit = width
    # limit = 100

    for c in range(width):
        print((c, y))
        if c > limit:
            break
        coordinate = (c, y)
        dbDraw(db, coordinate, color, width)


def bitmap2db(db, bitmap, boardId = 1):
    rows = len(bitmap)
    columns = len(bitmap[0])
    width = columns
    for r in range(rows):
        for c in range(columns):
            color = bitmap[r][c]
            coordinate = (c, r)
            # print(str(coordinate) + " = " + str(color))
            dbDraw(db, coordinate, color, width, boardId = boardId)

def getDbConnection():
    r = redis.StrictRedis(host='localhost', port=6379, db=0)
    # r = "die"
    print(dir(redis))
    return r

def main():
    bitmap = image2bitmap(pathToBitmap)
    # showBitmap(bitmap)
    # print("bitmap = " + str(bitmap))
    bitmap = colorBitmap(bitmap, 1, 0)
    # showBitmap(bitmap)
    dbHeight = 512
    dbWidth = 1024
    boardId = 1
    db = getDbConnection()
    # bitmap2db(db, bitmap)
    dbDrawHorizontalLine(db, 138, dbWidth, color = 12)

main()
