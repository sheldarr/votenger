import * as fs from 'fs';

const plugins = (on) => {
  on('task', {
    resetDb: () => {
      fs.writeFileSync('db.json', JSON.stringify({}));

      return null;
    },
  });
};

export default plugins;
