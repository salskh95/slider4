const express = require("express");
const fs = require("fs");
const path = require("path");
const serveStatic = require("serve-static");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
};

app.get('/images', (req, res)=>{
  const h3Dir = path.join(__dirname, 'public/images/h3');
  const creaturesDir = path.join(h3Dir, 'creatures');

  const h3Images = fs.readdirSync(h3Dir).filter(file=>!fs.statSync(h3Dir, file).isDirectory()).map(file=>`images/h3/${file}`);
  const creaturesImages = fs.readdirSync(creaturesDir).map(file=>path.relative(path.join(__dirname, 'public'), file).replace(/\\/g, '/'))
res.json({h3: h3Images, creatures: creaturesImages})
})

app.listen(PORT, ()=>{
  console.log('server is running on port 3000');
  
})