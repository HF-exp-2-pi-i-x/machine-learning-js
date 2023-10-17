const geometry = {};
// x right, y down

// compare vertical then horizontal
geometry.lowestPoint = (points) =>
  points.reduce((lowest, point) => {
    if (point[1] > lowest[1]) {
      return point;
    }
    if (point[1] === lowest[1] && point[0] < lowest[0]) {
      return point;
    }
    return lowest;
  });

if (typeof module !== "undefined") {
  module.exports = geometry;
}

// anti clockwise wrt origin
geometry.sortPoints = (origin, points) =>
  points.slice().sort((a, b) => {
    const orientation = getOrientation(origin, a, b);
    if (orientation === 0) {
      // if same angle, choose lowest one
      return distanceSquared(origin, a) - distanceSquared(origin, b);
    }
    return -orientation;
  });

// build convex hull
geometry.grahamScan = (points) => {
  const lowestPoint = geometry.lowestPoint(points);
  const sortedPoints = geometry.sortPoints(lowestPoint, points);

  const stack = [sortedPoints[0], sortedPoints[1], sortedPoints[2]];

  for (let i = 3; i < sortedPoints.length; i++) {
    let top = stack.length - 1;
    // exclude pts til new pt not concave
    while (
      top > 0 &&
      getOrientation(stack[top - 1], stack[top], sortedPoints[i]) <= 0
    ) {
      stack.pop();
      top--;
    }
    stack.push(sortedPoints[i]);
  }
  return stack;
};

// box with 1 edge coincident with edge between hull pt i & j
geometry.coincidentBox = (hull, i, j) => {
  // difference vector
  const diff = (a, b) => [a[0] - b[0], a[1] - b[1]];
  // dot product
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  // vector len
  const len = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]);
  // add
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  // multiply by n
  const mult = (a, n) => [a[0] * n, a[1] * n];
  // divide
  const div = (a, n) => [a[0] / n, a[1] / n];
  // unit vector
  const unit = (a) => div(a, len(a));

  let origin = hull[i];
  // base vectors where x axis conincident with i-j edge
  let baseX = unit(diff(hull[j], origin));
  // y axis orthgonal 90deg anti
  let baseY = [baseX[1], -baseX[0]];

  let left = 0,
    right = 0,
    top = 0,
    bottom = 0;

  for (const p of hull) {
    // pos rel to origin
    const n = [p[0] - origin[0], p[1] - origin[1]];
    // pos in new axis (rotate)
    const v = [dot(baseX, n), dot(baseY, n)];
    // cal bounding box
    left = Math.min(v[0], left);
    top = Math.min(v[1], top);
    right = Math.max(v[0], right);
    bottom = Math.max(v[1], bottom);
  }
  // cal bounding box vertices in original screen space
  const vertices = [
    add(add(mult(baseX, left), mult(baseY, top)), origin),
    add(add(mult(baseX, left), mult(baseY, bottom)), origin),
    add(add(mult(baseX, right), mult(baseY, bottom)), origin),
    add(add(mult(baseX, right), mult(baseY, top)), origin),
  ];

  return {
    vertices,
    width: right - left,
    height: bottom - top,
  };
};

// min bounding box
geometry.minimumBoundingBox = ({ points, hull }) => {
  hull = hull || geometry.grahamScan(points);

  let minArea = Number.MAX_VALUE;
  let result = null;
  for (let i = 0; i < hull.length; ++i) {
    const { vertices, width, height } = geometry.coincidentBox(
      hull,
      i,
      (i + 1) % hull.length
    );
    const area = width * height;
    if (area < minArea) {
      minArea = area;
      result = { vertices, width, height };
    }
  }
  return result;
};

// get p2 relative pos: right = 1, left = -1, line = 0
function getOrientation(p1, p2, p3) {
  const val =
    (p2[1] - p1[1]) * (p3[0] - p2[0]) - (p2[0] - p1[0]) * (p3[1] - p2[1]);
  if (val === 0) {
    return 0;
  }
  return val >= 0 ? 1 : -1;
}

// squared distance
function distanceSquared(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return dx * dx + dy * dy;
}

if (typeof module !== "undefined") {
  module.exports = geometry;
}
