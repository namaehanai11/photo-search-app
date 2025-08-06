// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 静的ファイル（index.htmlや画像）を公開
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// アップロード先の設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'photos');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// POST /upload 処理
app.post('/upload', upload.single('image'), (req, res) => {
  const name = req.body.name;
  const feature = req.body.feature;
  const file = req.file.filename;

  const dataPath = path.join(__dirname, 'data.json');
  const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];

  data.push({
    name,
    feature: feature.split(',').map(f => f.trim()),
    file
  });

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// 画像一覧取得
app.get('/images', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');
  const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];
  res.json(data);
});

// 検索
app.get('/search', (req, res) => {
  const keyword = req.query.keyword || '';
  const dataPath = path.join(__dirname, 'data.json');
  const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];

  const results = data.filter(item =>
    item.name.includes(keyword) || item.feature.some(f => f.includes(keyword))
  );

  res.json(results);
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`✅ サーバー起動中: http://localhost:${PORT}`);
});

// 編集機能（PUTリクエスト）
app.put('/edit/:filename', (req, res) => {
  const { name, feature } = req.body;
  const filename = req.params.filename;
  
  const dataPath = path.join(__dirname, 'data.json');
  let data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];

  const index = data.findIndex(item => item.file === filename);
  
  if (index !== -1) {
    // データの更新
    data[index].name = name;
    data[index].feature = feature.split(',').map(f => f.trim());
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'データが見つかりません' });
  }
});

// 削除機能（DELETEリクエスト）
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;

  const dataPath = path.join(__dirname, 'data.json');
  let data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];

  // 該当するファイル名で削除
  data = data.filter(item => item.file !== filename);
  
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json({ success: true });
});