const fs = require("fs");
const parseString = require("xml2js").parseString;
const Builder = require("xml2js").Builder;

// patch to "handling" folder
const folderPath = "./handling";


fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {

    const xmlFilePath = `${folderPath}/${file}`;

    fs.readFile(xmlFilePath, (err, data) => {
      if (err) throw err;

      parseString(data, (err, result) => {
        if (err) throw err;

        const items = result.CHandlingDataMgr.HandlingData[0].Item;

        items.forEach((item) => {
          const handlingName = item.handlingName[0].toUpperCase();

          const xmlObject = {
            CHandlingDataMgr: {
              HandlingData: {
                Item: item,
              },
            },
          };

          const xml = new Builder({ standalone: false }).buildObject(xmlObject);

          const repXml = xml.replace(
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
            `<?xml version="1.0" encoding="UTF-8"?>`
          );

          fs.writeFile(`out/${handlingName}.meta`, repXml, (err) => {
            if (err) throw err;
            console.log(`Save file "${handlingName}.meta"`);
          });
        });
      });
    });
  });
});
