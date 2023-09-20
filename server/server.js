const PORT = 5000;
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const md5 = require('md5');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  return res.status(200).send("It's working");
});

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uploadFile = req.files.file;
  const originalName = uploadFile.name;
  const fileName = md5(originalName) + '_' + originalName;
  const filePath = `${__dirname}/public/files/${fileName}`;

  uploadFile.mv(filePath, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err });
    }

    const responseData = {
      status: 'uploaded',
      originalName: originalName,
      savedAs: fileName,
      filePath: filePath,
    };

    // Send the JSON response
    return res.status(200).json(responseData);
  });
});

app.listen(PORT, () => {
  console.log('Server Running successfully.');
});
