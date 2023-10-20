if (typeof utils === "undefined") {
  utils = require("../utils.js");
}

class KNN {
  constructor(samples, k) {
    this.samples = samples;
    this.k = k;
  }
  predict(point) {
    const samplePoints = this.samples.map((s) => s.point);
    const { indices, distances } = utils.getNearest(
      point,
      samplePoints,
      this.k
    );
    const nearestSamples = indices.map((i, index) => {
      let weight;
      const epsilon = 1e-6;
      if (distances[index] == 0) {
        weight = 1 / epsilon;
      } else {
        weight = 1 / distances[index];
      }
      return { ...this.samples[i], weight };
    });
    const labels = nearestSamples.map((s) => s.label);
    const weightedCounts = {};
    for (const sample of nearestSamples) {
      weightedCounts[sample.label] = weightedCounts[sample.label]
        ? weightedCounts[sample.label] + sample.weight
        : sample.weight;
    }
    const maxWeight = Math.max(...Object.values(weightedCounts));
    let totalWeight = 0;
    for (const label in weightedCounts) {
      totalWeight += weightedCounts[label];
    }
    const accuracy = `${math.formatNumber(
      (maxWeight / totalWeight) * 100,
      2
    )}%`;
    const label = labels.find((l) => weightedCounts[l] == maxWeight);
    return { label, nearestSamples, accuracy };
  }

  guess() {
    const labels = this.samples.map((s) => s.label);
    labels.filter((label, i) => labels.indexOf(label) === i);
    return labels[Math.floor(Math.random() * labels.length)];
  }
}

if (typeof module !== "undefined") {
  module.exports = KNN;
}
