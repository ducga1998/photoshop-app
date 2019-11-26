import * as devConfig from './config.dev';
import * as productionConfig from './config.production';

let config = devConfig;

if (process.env.REACT_APP_ENV === 'production') {
  config = productionConfig;
} else {
  config = devConfig;
}

export default config;
