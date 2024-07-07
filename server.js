const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5500;

app.use(express.static(path.join(__dirname, "public")));

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
};

app.get('/images', (req, res) => {
  console.log("Received request at /images");
  const h3Dir = path.join(__dirname, 'public/images/h3');
  const creaturesDir = path.join(h3Dir, 'creatures');

  let h3Images = [];
  let creaturesImages = [];

  try {
    console.log('Reading h3 directory:', h3Dir);
    
    const h3Files = getAllFiles(h3Dir);
    h3Images = h3Files.map(file => path.relative(path.join(__dirname, 'public'), file).replace(/\\/g, '/'));

    console.log('Reading creatures directory:', creaturesDir);
    const creaturesFiles = getAllFiles(creaturesDir);
    creaturesImages = creaturesFiles.map(file => path.relative(path.join(__dirname, 'public'), file).replace(/\\/g, '/'));
  
    console.log('h3 images:', h3Images);
    console.log('creatures images:', creaturesImages);
    
  } catch (error) {
    console.error('Error reading files:', error);
    return res.status(500).json({ error: 'Error reading files' });
  }

  res.json({ h3: h3Images, creatures: creaturesImages });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
