const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

// Endpoint for uploading a picture
app.post('/upload', upload.single('picture'), (req, res) => {
    
    // Access uploaded file information
    const uploadedFile = req.file;
    
    // Move the file to a permanent storage location
    const targetPath = 'uploads/' + uploadedFile.filename;
    fs.rename(uploadedFile.path, targetPath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      res.send('Picture uploaded successfully');
    });});

// Endpoint for serving random pictures
app.get('/get-picture', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Filter out directories (if any)
      const imageFiles = files.filter(file => {
        return fs.statSync(path.join('uploads/', file)).isFile();
      });
  
      // Send array of file names as response
      res.json(imageFiles);
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
