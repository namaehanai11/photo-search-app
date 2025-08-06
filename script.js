let people = [];

// ページ読み込み時にlocalStorageからデータを読み込む
document.addEventListener('DOMContentLoaded', () => {
  const storedData = localStorage.getItem('people');
  if (storedData) {
    people = JSON.parse(storedData);
    displayPeople();  // 保存されたデータを表示
  }
});

// データをlocalStorageに保存する関数
function saveToLocalStorage() {
  localStorage.setItem('people', JSON.stringify(people));
}

// 画像プレビューの表示
document.getElementById('imageInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('imagePreview');

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Image preview">`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = '';
  }
});

// 検索機能
function search() {
  const keyword = document.getElementById('searchInput').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  const matches = people.filter(p =>
    p.name.includes(keyword) || p.feature.includes(keyword)
  );

  if (matches.length === 0) {
    resultDiv.innerText = '見つかりませんでした。';
    return;
  }

  matches.forEach(p => {
    const div = document.createElement('div');
    div.className = 'person';
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>特徴: ${p.feature.join(', ')}</p>
      <img src="photos/${p.file}" width="200"><br>
      <button class="editBtn">編集</button>
      <button class="deleteBtn">削除</button>
    `;
    resultDiv.appendChild(div);

    // 編集ボタンのイベントリスナー
    div.querySelector('.editBtn').addEventListener('click', () => {
      document.getElementById('nameInput').value = p.name;
      document.getElementById('featuresInput').value = p.feature.join(', ');
      document.getElementById('imageInput').value = p.file;
      people = people.filter(item => !(item.name === p.name && item.file === p.file));
      resultDiv.removeChild(div);
      saveToLocalStorage();
    });

    // 削除ボタンのイベントリスナー
    div.querySelector('.deleteBtn').addEventListener('click', () => {
      people = people.filter(item => !(item.name === p.name && item.file === p.file));
      resultDiv.removeChild(div);
      saveToLocalStorage();
    });
  });
}

// 掛け軸を追加する関数
function addKakejiku() {
  const name = document.getElementById('nameInput').value.trim();
  const features = document.getElementById('featuresInput').value.split(/[,、]/).map(f => f.trim());
  const image = document.getElementById('imageInput').files[0];

  if (!name || features.length === 0 || !image) {
    alert('すべての項目を入力してください。');
    return;
  }

  const imageName = image.name; // 画像のファイル名を取得

  // 新しい掛け軸をpeople配列に追加
  people.push({
    name: name,
    feature: features,
    file: imageName
  });

  // localStorageに保存
  saveToLocalStorage();

  // 表示部分
  const resultDiv = document.getElementById('result');
  const div = document.createElement('div');
  div.className = 'person';
  div.innerHTML = `
    <h3>${name}</h3>
    <p>特徴: ${features.join(', ')}</p>
    <img src="photos/${imageName}" width="200"><br>
    <button class="editBtn">編集</button>
    <button class="deleteBtn">削除</button>
  `;
  resultDiv.appendChild(div);

  // 編集ボタンのイベントリスナー
  div.querySelector('.editBtn').addEventListener('click', () => {
    document.getElementById('nameInput').value = name;
    document.getElementById('featuresInput').value = features.join(', ');
    document.getElementById('imageInput').value = imageName;
    people = people.filter(p => !(p.name === name && p.file === imageName));
    resultDiv.removeChild(div);
    saveToLocalStorage();
  });

  // 削除ボタンのイベントリスナー
  div.querySelector('.deleteBtn').addEventListener('click', () => {
    people = people.filter(p => !(p.name === name && p.file === imageName));
    resultDiv.removeChild(div);
    saveToLocalStorage();
  });

  alert('掛け軸を追加しました！');
}

// JSONをダウンロードする関数
function downloadJSON() {
  const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kakejiku-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

// すべての掛け軸を表示する関数
function displayPeople() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';  // 既存の結果をクリア
  people.forEach(p => {
    const div = document.createElement('div');
    div.className = 'person';
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>特徴: ${p.feature.join(', ')}</p>
      <img src="photos/${p.file}" width="200"><br>
      <button class="editBtn">編集</button>
      <button class="deleteBtn">削除</button>
    `;
    resultDiv.appendChild(div);

    // 編集ボタンのイベントリスナー
    div.querySelector('.editBtn').addEventListener('click', () => {
      document.getElementById('nameInput').value = p.name;
      document.getElementById('featuresInput').value = p.feature.join(', ');
      document.getElementById('imageInput').value = p.file;
      people = people.filter(item => !(item.name === p.name && item.file === p.file));
      resultDiv.removeChild(div);
      saveToLocalStorage();
    });

    // 削除ボタンのイベントリスナー
    div.querySelector('.deleteBtn').addEventListener('click', () => {
      people = people.filter(item => !(item.name === p.name && item.file === p.file));
      resultDiv.removeChild(div);
      saveToLocalStorage();
    });
  });
}