import { join } from 'path';

module.exports = (appInfo: any) => {
  const exports = {} as any;
  exports.staticFile = {
    prefix: '/',
    dir: join(appInfo.baseDir, '../public'),
    preload: false,
    buffer: true,     // 注意，这里是 true
  };
  return exports;
};