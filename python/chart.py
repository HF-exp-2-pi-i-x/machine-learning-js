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

labels = list(classes.keys())

colors = ["b", "g", "r", "c", "m", "y", "k", "brown"]


def readFeatureFile(filePath):
    f = open(filePath, "r")
    lines = f.readlines()

    X = []
    for i in range(1, len(lines)):
        row = lines[i].split(",")
        X.append([float(row[j]) for j in range(len(row) - 1)])
        X[i - 1].append(classes[row[-1].strip()])
    return X


X = readFeatureFile("../data/dataset/testing.csv")


width = []
height = []

for i in range(0, 8):
    width.append([])
    height.append([])
    for sample in X:
        if sample[2] == i:
            width[i].append(sample[0])
            height[i].append(sample[1])


# scatter
for i in range(0, 8):
    plt.scatter(width[i], height[i], c=colors[i], label=labels[i])


# labels & title
plt.xlabel("Width")
plt.ylabel("Height")
plt.title("Drawing app width vs height")

plt.legend()


plt.show()
