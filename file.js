const fs = require('fs');

const saveMetadataUri = (uri) => {
    const filename = `meta.txt`;
    fs.writeFileSync(`./${filename}`, uri + "\r\n", { flag: "a+" });
};

module.exports = {
    saveMetadataUri: saveMetadataUri,
};