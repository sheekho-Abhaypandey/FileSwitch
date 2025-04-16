
const fs=require('fs');
const path=require('path');

const cleanFolder = (folderPath) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) return console.error("Error reading folder:", err);
      files.forEach(file => {
        fs.unlink(path.join(folderPath, file), err => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    });
  };

  
  module.exports = cleanFolder;