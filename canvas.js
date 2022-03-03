const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const canvas = createCanvas(500, 500);
const ctx = canvas.getContext("2d");

const FILE_PATH = "./Images";

const saveImage = (canvas, index) => {
 const filename = `N${index.toString().padStart(3, 0)}`;

 fs.writeFileSync(
   `${FILE_PATH}/_Final/${filename}.png`,
   canvas.toBuffer("image/png")
 );

 //console.log(filename);
};

const createImage = async (t, i) => {
 const face = await loadImage(`${FILE_PATH}/Face/${t[0]}.png`);
 const body = await loadImage(`${FILE_PATH}/Body/${t[1]}.png`);
 const background = await loadImage(`${FILE_PATH}/Background/${t[2]}.png`);

 await ctx.drawImage(background, 0, 0, 500, 500);
 await ctx.drawImage(body, 0, 0, 500, 500);
 await ctx.drawImage(face, 0, 0, 500, 500);

 saveImage(canvas, i + 1);
};

exports.createImage = createImage