let people = [];

fetch('data.json')
  .then(res => res.json())
  .then(data => people = data);

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
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>特徴: ${p.feature}</p>
      <img src="photos/${p.file}" width="200">
    `;
    resultDiv.appendChild(div);
  });
}

function addKakejiku() {
  const name = document.getElementById('nameInput').value.trim();
  const features = document.getElementById('featuresInput').value.split(',').map(f => f.trim());
  const image = document.getElementById('imageInput').value.trim();

  if (!name || features.length === 0 || !image) {
    alert('すべての項目を入力してください。');
    return;
  }

  people.push({
    name: name,
    feature: features,
    file: image
  });

    // 表示部分
  const resultDiv = document.getElementById('result');
  const div = document.createElement('div');
  div.className = 'person';
  div.innerHTML = `
    <h3>${name}</h3>
    <p>特徴: ${features.join(', ')}</p>
    <img src="photos/${image}" width="200"><br>
    <button class="editBtn">編集</button>
    <button class="deleteBtn">削除</button>
  `;
  resultDiv.appendChild(div);

  // イベントリスナーを追加
  div.querySelector('.editBtn').addEventListener('click', () => {
    document.getElementById('nameInput').value = name;
    document.getElementById('featuresInput').value = features.join(', ');
    document.getElementById('imageInput').value = image;
    people = people.filter(p => !(p.name === name && p.file === image));
    resultDiv.removeChild(div);
  });

  div.querySelector('.deleteBtn').addEventListener('click', () => {
    people = people.filter(p => !(p.name === name && p.file === image));
    resultDiv.removeChild(div);
  });

  alert('掛け軸を追加しました！');
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kakejiku-data.json';
  a.click();
  URL.revokeObjectURL(url);
}