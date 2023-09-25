const draw = require("../common/draw.js");
const constants = require("../common/constants.js");
const utils = require("../common/utils.js");

const { createCanvas } = require("canvas");
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

const fs = require("fs");

const fileNames = fs
  .readdirSync(constants.RAW_DIR)
  .filter((fn) => fn !== ".DS_Store");

const samples = [];
let id = 1;
fileNames.forEach((fn) => {
  const content = fs.readFileSync(constants.RAW_DIR + "/" + fn);
  const { session, student, drawings } = JSON.parse(content);
  for (let label in drawings) {
    samples.push({
      id,
      label,
      student_name: student,
      student_id: session,
    });

    const paths = drawings[label];
    // get json dataset
    fs.writeFileSync(
      constants.JSON_DIR + "/" + id + ".json",
      JSON.stringify(paths)
    );
    // get img dataset
    generateImageFile(constants.IMG_DIR + "/" + id + ".png", paths);
    utils.printProgress(id, fileNames.length * 8);
    id++;
  }
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));

fs.writeFileSync(
  constants.SAMPLES_JS,
  "const samples =" + JSON.stringify(samples) + ";"
);

function generateImageFile(outFile, paths) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw.paths(ctx, paths);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outFile, buffer);
}
