// server.js

const express = require('express');
const path = require('path');
const app = express();

// 静的ファイルを提供
app.use(express.static(path.join(__dirname, 'public')));

// API ルート（例: GET /images など）
app.get('/images', (req, res) => {
  res.json([{ name: '画像名', feature: ['特徴1', '特徴2'], file: 'image.jpg' }]);
});

// 全てのリクエストを index.html にリダイレクト
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// サーバーをポート3000で開始（Vercelではサーバーレスとして動作するため、ポートは不要）
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });

module.exports = app;