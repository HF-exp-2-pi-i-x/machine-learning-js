const features = {};

features.getPathCount = (paths) => {
  return paths.length;
};

features.getPointCount = (paths) => {
  const points = paths.flat();
  return points.length;
};

features.getFullness = (paths) => {
  const points = paths.flat();
  return points.length / 160000;
};

features.getAspectRatio = (paths) => {
  const points = paths.flat();

  const xCoordinates = points.map((pt) => pt[0]);
  const yCoordinates = points.map((pt) => pt[1]);
  const width = Math.max(...xCoordinates) - Math.min(...yCoordinates);
  const height = Math.max(...yCoordinates) - Math.min(...xCoordinates);
  return width / height;
};

if (typeof module !== "undefined") {
  module.exports = features;
}
