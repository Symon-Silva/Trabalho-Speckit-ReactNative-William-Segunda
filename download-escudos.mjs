import https from 'https';
import fs from 'fs';
import path from 'path';

const root = process.cwd();

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location;
          const url2 = loc.startsWith('http') ? loc : new URL(loc, url).href;
          https
            .get(url2, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
              res2.pipe(file);
              file.on('finish', () => {
                file.close();
                resolve();
              });
            })
            .on('error', reject);
          return;
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', reject);
  });
}

async function run() {
  await download(
    'https://assets.football-logos.cc/logos/brazil/512x512/gremio.png',
    path.join(root, 'assets', 'times', 'gremio.png'),
  );
  await download(
    'https://assets.football-logos.cc/logos/brazil/512x512/internacional.png',
    path.join(root, 'assets', 'times', 'internacional.png'),
  );
  const g = fs.statSync(path.join(root, 'assets', 'times', 'gremio.png')).size;
  const i = fs.statSync(path.join(root, 'assets', 'times', 'internacional.png')).size;
  console.log(g, i);
}

run();
