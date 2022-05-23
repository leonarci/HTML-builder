const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, '/styles');

async function bundleStyles(dir) {
  const styles = [];
  const outputFile = path.join(__dirname, '/project-dist', '/bundle.css');
  const writeStyles = fs.createWriteStream(outputFile, 'utf-8');
  fs.readdir(dir, {withFileTypes: true} ,(err, files) => {
    if(err) throw err;
    files = files.filter(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        return file;
      }
    });
    for (const file of files) {
      const filePath = path.join(srcDir, file.name);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        styles.push(data);
        if (styles.length === files.length) {
          styles.forEach(style => writeStyles.write(style));
        }  
      });
    }
  }
  );
}

bundleStyles(srcDir);
