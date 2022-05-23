const fs = require('fs/promises');
const path = require('path');

const files = path.join(__dirname, 'files');
const filesCopy = path.join(__dirname, 'files-copy');

async function copyDir (from, to) {
  try {
    if(to === filesCopy) {
      await fs.mkdir(to, {recursive: true});
      const files = await fs.readdir(to);
      if (files.length !== 0) {
        for (const file of files) {
          await fs.rm(path.join(to, file), {recursive: true, force: true});
        }
      }
    }
    const files = await fs.readdir(from, {withFileTypes: true});
    for (const file of files) {
      if(file.isFile()) {
        fs.copyFile(path.join(from, file.name), path.join(to, file.name));
        console.log(`file coppied: ${file.name}`);
      } else if (file.isDirectory()) {
        await fs.mkdir(path.join(to, file.name));
        console.log(`folder created: ${file.name}`);
        copyDir(path.join(from, file.name), path.join(to, file.name));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

copyDir(files, filesCopy);
