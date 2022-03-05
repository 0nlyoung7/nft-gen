const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const { face, body, background } = require("./traits.js");
const { saveMetadataUri } = require("./file.js");
const pinataSDK = require("@pinata/sdk");

require('dotenv').config()

const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);
const IPFS21_URL = "https://gateway.pinata.cloud/ipfs";
const IPFS_IMAGE_HASH = process.env.PINATA_HASH;

const canvas = createCanvas(500, 500);
const ctx = canvas.getContext("2d");

const FILE_PATH = "./Images";

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

const saveImage = (canvas, index) => {
 const filename = `N${index.toString().padStart(3, 0)}`;
 fs.writeFileSync(
   `${FILE_PATH}/_Final/${filename}.png`,
   canvas.toBuffer("image/png")
 );
 //console.log(filename);
};

const saveMeta = (t, index) => {
    const filename = `N${index.toString().padStart(3, 0)}`;
    fs.writeFileSync(
        `./meta/${filename}.json`,
        JSON.stringify({face: t[0], body: t[1], background: t[2]})
    );
};

const findMeta = (index) => {
  const filename = `N${index.toString().padStart(3, 0)}`;
  if (fs.existsSync( `./meta/${filename}.json`)){
    var json = require(`./meta/${filename}.json`)
    return json
  } else {
    return null;
  }
}

const create = async (t, i) => {
 var info = t;
 var jndex = i+1;
 var meta = findMeta(jndex);
 if (meta) {
    info = [meta.face, meta.body, meta.background];
 } else {
    const face = await loadImage(`${FILE_PATH}/Face/${t[0]}.png`);
    const body = await loadImage(`${FILE_PATH}/Body/${t[1]}.png`);
    const background = await loadImage(`${FILE_PATH}/Background/${t[2]}.png`);

    await ctx.drawImage(background, 0, 0, 500, 500);
    await ctx.drawImage(body, 0, 0, 500, 500);
    await ctx.drawImage(face, 0, 0, 500, 500);

    saveImage(canvas, jndex);
    saveMeta(t, jndex);
 }

 await uploadMetaData(info, i + 1);
};

const uploadMetaData = async (t, i) => {
 let metadata = {
   description: "CLEGO::Cutty Lego NFT",
   name: `CLEGO-${i}`,
   type: "Collectable",
   image: "https://",
   attributes: [],
 };

 for (let k = 0; k < 3; k++) {
   metadata.attributes.push(getAttributes(t[k], k));
 }
 const filename = `N${i.toString().padStart(3, 0)}`;
 metadata.image = `${IPFS_URL}/${IPFS_IMAGE_HASH}/${filename}.png`;

 const options = {
   pinataMetadata: { name: "cutty-lego-nft-meta" },
   pinataOptions: {
     cidVersion: 0,
   },
 };

 try {
   const result = await pinata.pinJSONToIPFS(metadata, options);
   console.log(result);

   saveMetadataUri(`${i}=${IPFS_URL}/${result.IpfsHash}`);
 } catch (err) {
   console.log(err);
 }
};

const readMetadataPinataUri = async (index) => {
    const buffer = await fs.readFileSync(META_FILE);
    let tokenUri = "";
  
    let regexp = new RegExp("(\r?\n)?" + index + "=(.*)", "g");
    let result = buffer.toString().match(regexp);
  
    if (result != null) {
      tokenUri = result[0].slice(result[0].indexOf("=") + 1);
    }
  
    return tokenUri;
};

module.exports = {
 createPinata: create,
};