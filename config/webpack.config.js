const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const env = process.env.IONIC_ENV;

if (env === 'prod' || env === 'dev') {
  useDefaultConfig[env].resolve.alias = {
    '@app': path.resolve('./src/app/'),
    '@assets': path.resolve('./src/assets/'),
    '@env': path.resolve(environmentPath()),
    '@helpers': path.resolve('./src/helpers/'),
    '@models': path.resolve('./src/models/'),
    '@pages': path.resolve('./src/pages/'),
    '@providers': path.resolve('./src/providers/'),
    '@theme': path.resolve('./src/theme/')
  };
} else {
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    '@app': path.resolve('./src/app/'),
    '@assets': path.resolve('./src/assets/'),
    '@env': path.resolve(environmentPath()),
    '@helpers': path.resolve('./src/helpers/'),
    '@models': path.resolve('./src/models/'),
    '@pages': path.resolve('./src/pages/'),
    '@providers': path.resolve('./src/providers/'),
    '@theme': path.resolve('./src/theme/')
  };
}

function environmentPath() {
  let filePath = `./src/environments/environment${
    env === 'prod' ? '' : '.' + env
  }.ts`;

  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`\n${filePath} does not exist!`));
  } else {
    return filePath;
  }
}

module.exports = function() {
  return useDefaultConfig;
};
