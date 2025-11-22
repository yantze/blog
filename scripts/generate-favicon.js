const { favicons } = require('favicons');
const path = require('path');
const fs = require('fs');

const source = path.join(__dirname, '../source/images/fav/original.png');
const outputDir = path.join(__dirname, '../source/images/fav');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const configuration = {
  path: '/images/fav/', // HTML 中引用的路径
  appName: 'Vastiny',
  appShortName: 'Vastiny',
  appDescription: 'Vastiny Blog',
  developerName: 'Vastiny',
  developerURL: 'https://vastiny.com',
  dir: 'auto',
  lang: 'zh-CN',
  background: '#fff',
  theme_color: '#fff',
  appleStatusBarStyle: 'black-translucent',
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/',
  version: '1.0',
  logging: true,
  pixel_art: false,
  loadManifestWithCredentials: false,
  manifestMaskable: false,
  icons: {
    android: false,
    appleIcon: false,
    appleStartup: false,
    favicons: true,
    windows: false,
    yandex: false
  }
};

favicons(source, configuration)
  .then((response) => {
    // 保存所有生成的图片文件
    response.images.forEach((image) => {
      const filePath = path.join(outputDir, image.name);
      fs.writeFileSync(filePath, image.contents);
      console.log(`✓ 生成: ${image.name}`);
    });

    // 保存 HTML 片段（可选，用于查看）
    // const htmlPath = path.join(outputDir, 'favicon-html.html');
    // fs.writeFileSync(htmlPath, response.html.join('\n'));
    // console.log(`✓ 生成 HTML 片段: favicon-html.html`);

    // 保存 manifest 文件（如果有）
    // if (response.files && response.files.length > 0) {
    //   response.files.forEach((file) => {
    //     const filePath = path.join(outputDir, file.name);
    //     fs.writeFileSync(filePath, file.contents);
    //     console.log(`✓ 生成: ${file.name}`);
    //   });
    // }

    console.log('\n✅ Favicon 生成完成！');
  })
  .catch((error) => {
    console.error('❌ 生成 favicon 时出错:', error);
    process.exit(1);
  });

