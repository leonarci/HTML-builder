const fs = require('fs');
const path = require('path');

const template = path.join(__dirname, '/template.html');
const stylesPath = path.join(__dirname, '/styles');
const assets = path.join(__dirname, '/assets');
const assetsCopied = path.join(__dirname, '/project-dist', '/assets');

(function createProjectDist(dir) {
  const projectDist = path.join(dir, '/project-dist');
  fs.mkdir(projectDist, { recursive: true }, (err) => {
    if(err) throw err;
    createIndexHtml();
    bundleStyles(stylesPath);
    copyDir(assets, assetsCopied);
  });
})(__dirname);

async function createIndexHtml() {
  createComponentsObj('/components', result => parseTemplate(result));
}

function createComponentsObj(dirname, callback) {
  const components = {};
  const componentsDir = path.join(__dirname, dirname);
  fs.readdir(componentsDir, {withFileTypes: true},(err, files) => {
    if (err) throw err;
    files = files.filter(file => {
      if (file.isFile() && path.extname(file.name) === '.html') {
        return file;
      }
    });
    for (const file of files) {
      const filePath = path.join(componentsDir, file.name);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        components[file.name] = data;
        if (files.indexOf(file) === files.length - 1) {
          callback(components);
        }  
      });
    }
  });
}

function parseTemplate(components) {
  const input = fs.createReadStream(template, 'utf-8');
  const outputPath = path.join(__dirname, '/project-dist', '/index.html');
  const output = fs.createWriteStream(outputPath, 'utf-8');
  input.on('data', (chunk) => {
    let regexp = /{{\w+}}/g;
    let data = chunk;
    const modData = data.replace(regexp, (match) => {
      return components[`${match.slice(2, -2)}.html`];
    });
    output.write(modData);
  });
}

async function bundleStyles(dir) {
  const styles = [];
  const outputFile = path.join(__dirname, '/project-dist', '/style.css');
  const writeStyles = fs.createWriteStream(outputFile, 'utf-8');
  fs.readdir(dir, {withFileTypes: true} ,(err, files) => {
    if(err) throw err;
    files = files.filter(file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        return file;
      }
    });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
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

async function copyDir (from, to) {
  try {
    if(to === assetsCopied) {
      await fs.promises.mkdir(to, {recursive: true});
      const files = await fs.promises.readdir(to);
      if (files.length !== 0) {
        for (const file of files) {
          await fs.promises.rm(path.join(to, file), {recursive: true, force: true});
        }
      }
    }
    const files = await fs.promises.readdir(from, {withFileTypes: true});
    for (const file of files) {
      if(file.isFile()) {
        fs.promises.copyFile(path.join(from, file.name), path.join(to, file.name));
        console.log(`file coppied: ${file.name}`);
      } else if (file.isDirectory()) {
        await fs.promises.mkdir(path.join(to, file.name));
        console.log(`folder created: ${file.name}`);
        copyDir(path.join(from, file.name), path.join(to, file.name));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}
