const { readdir, stat } = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

readdir(folder, {withFileTypes: true})
  .then((value) => {
    value.forEach(file => {
      if (file.isFile()) {
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        const ext = path.extname(file.name).slice(1);
        stat(path.join(folder, file.name)).then( value => {
          const size = (value.size / 1024).toFixed(2) + 'kb';
          console.log(`${name} - ${ext} - ${size}`);
        });
      }
    });
  });
