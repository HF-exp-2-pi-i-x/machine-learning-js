import matplotlib.pyplot as plt

# import numpy as np


# example data
classes = {
    "car": 0,
    "fish": 1,
    "house": 2,
    "tree": 3,
    "bicycle": 4,
    "guitar": 5,
    "pencil": 6,
    "clock": 7,
}


def readFeatureFile(filePath):
    f = open(filePath, "r")
    lines = f.readlines()

    X = []
    y = []
    for i in range(1, len(lines)):
        row = lines[i].split(",")
        X.append([float(row[j]) for j in range(len(row) - 1)])
        y.append(classes[row[-1].strip()])
    return (X, y)


X, y = readFeatureFile("../data/dataset/testing.csv")

width = [point[0] for point in X]
height = [point[1] for point in X]

# scatter
plt.scatter(width, height, c=y, cmap="viridis", label="Labels")

# labels & title
plt.xlabel("Width")
plt.ylabel("Height")
plt.title("Drawing app width vs height")

plt.legend()


plt.show()
