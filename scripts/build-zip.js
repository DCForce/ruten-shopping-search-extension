const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 建立 ZIP 檔案
const buildZip = () => {
  const DEST_DIR = path.join(__dirname, '../dist');
  const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip'); 

  // 創建輸出目錄（如果不存在）
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR);
  }

  const packageInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  const zipFilename = `multi-platform-shopping-search-v${packageInfo.version}.zip`;
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(path.join(DEST_ZIP_DIR, zipFilename));

  return new Promise((resolve, reject) => {
    archive
      .directory(DEST_DIR, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

// 執行
buildZip()
  .then(() => console.log('ZIP 檔案建立完成'))
  .catch(console.error);