const { readdir, stat } = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

try {
  readdir(folder, {withFileTypes: true})
    .then((value) => {
      value.forEach(file => {
        if (file.isFile()) {
          const {name, ext} = path.parse(file.name);
          stat(path.join(folder, file.name)).then( value => {
            const size = (value.size / 1024).toFixed(2) + 'kb';
            console.log(`${name} - ${ext.slice(1)} - ${size}`);
          });
        }
      });
    }).catch(error => console.error(error.message));
} catch (error) {
  console.error(error.message);
}
