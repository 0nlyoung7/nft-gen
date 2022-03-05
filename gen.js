const { face, body, background } = require('./traits');
const { createPinata } = require('./createPinata');

const NUM_OF_FACES = 30;
const NUM_OF_BODY = 12;
const NUM_OF_BACKGROUND = 3;

const TARGET_NUM_OF_NFT = 500;
const RARE_TRAIT = 77;
const MAX_NUM_OF_RARITY = 2;

let NFTs = [];
let totalCountOfRareTrait = 0;

const fnRng = (limit) => {
    return Math.floor(Math.random() * limit);
};

const fnCheckRareTrait = (t) => {
    if (NFTs.length > 0 && t === RARE_TRAIT) {
      totalCountOfRareTrait++;
      if (totalCountOfRareTrait > MAX_NUM_OF_RARITY) {
        totalCountOfRareTrait--;
   
        return fnCheckRareTrait(face[fnRng(NUM_OF_FACES)].id);
      }
      return t;
    } else {
      return t;
    }
};

const fnGenerateWithoutRedundancy = () => {
    let nftTobe = [];
   
    nftTobe.push(fnCheckRareTrait(face[fnRng(NUM_OF_FACES)].id));
    nftTobe.push(body[fnRng(NUM_OF_BODY)].id);
    nftTobe.push(background[fnRng(NUM_OF_BACKGROUND)].id);
   
    if (NFTs.length > 0) {
        for (let i = 0; i < NFTs.length; i++) {
            if (JSON.stringify(NFTs[i]) === JSON.stringify(nftTobe)) {
                return null;
            }
        }
    }
    return nftTobe;
};

while (NFTs.length < TARGET_NUM_OF_NFT) {
    const n = fnGenerateWithoutRedundancy();
    if (n !== null) {
        NFTs.push(n);
    }
}

(async () => {
    console.log("Creating...");
    for (let i = 0; i < NFTs.length; i++) {
      await createPinata(NFTs[i], i);
    }
   })();

console.log(`TOTAL_NUM_OF_NFT = ${NFTs.length}`);
console.log(`TOTAL_NUM_OF_RARITY = ${totalCountOfRareTrait}`);
   