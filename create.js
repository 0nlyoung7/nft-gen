const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const canvas = createCanvas(500, 500);
const ctx = canvas.getContext("2d");

const FILE_PATH = "./Images";

const { NFTStorage, File } = require("nft.storage");
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUwMGQxNTNmNzc3RUE1NTYyN0E4QjIyOWU1ODliMGU5RjRFQTk5NDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NjQ2NDA0OTI2MywibmFtZSI6ImN1dGUtbGVnbyJ9.xQmQICcGrnrpD1Z3czAbHI8fzKwxiLCSLQ3pNAx6vv4";
const client = new NFTStorage({ token: apiKey });

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

 await uploadMetaData(t, i + 1); // metadata upl
};

const getAttributes = (v, k) => {
  let attributes = {};
  let trait_type = "";
  let value = "";
 
  switch (k) {
    case 0:
      trait_type = "Face";
      value = face[v - 1].name;
      break;
 
    case 1:
      trait_type = "Body";
      value = body[v - 1].name;
      break;
 
    case 2:
      trait_type = "Background";
      value = background[v - 1].name;
      break;
 
    default:
      trait_type = "";
      value = "";
  }
 
  attributes.trait_type = trait_type;
  attributes.value = value;
 
  return attributes;
 };
 
 const uploadMetaData = async (t, i) => {
  let metadata = {
    description: "ALS::Alice Loves Sea NFT",
    name: `ALS-${i}`,
    type: "Collectable",
    image: "https://",
    attributes: [],
  };
 
  for (let k = 0; k < 3; k++) {
    metadata.attributes.push(getAttributes(t[k], k));
  }
  const filename = `N${i.toString().padStart(3, 0)}`;
 
  metadata.image = new File(
    [await fs.promises.readFile(`${FILE_PATH}/_Final/${filename}.png`)],
    `${filename}.png`,
    { type: "image/png" }
  );
 
  const result = await client.store(metadata);
  console.log(result.url);
  saveMetadataUri(`${i}=${result.url}`);
 };   


exports.createImage = createImage