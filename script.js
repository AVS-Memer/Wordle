var boxes = document.getElementById('pattern').getElementsByTagName('td');
var word = document.getElementById('word');
var colors = ['gray', 'rgb(255,196,37)', 'rgb(1,154,1)'];
var n = Array.from({ length: 6 }, () => Array(5).fill(0));
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 5; j++) {
    boxes[5 * i + j].onclick = () => {
      n[i][j] = (n[i][j] + 1) % 3;
      boxes[5 * i + j].style.backgroundColor = colors[n[i][j]];
      if (boxes[0].innerText !== "") [...boxes].forEach(a => a.innerText = "");
    };
  }
}

var pattern = (guess, answer) => {
  const r = Array(5).fill(0);
  const remain = {};
  // Count letters
  for (const ch of answer) remain[ch] = (remain[ch] || 0) + 1;
  // Greens
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      r[i] = 2;
      remain[guess[i]]--;
    }
  }
  // Yellows
  for (let i = 0; i < 5; i++) {
    if (r[i] === 0 && remain[guess[i]] > 0) {
      r[i] = 1;
      remain[guess[i]]--;
    }
  }
  console.log(r);
  return r;
};

fetch('/words.json')
  .then(response => response.json())
  .then(words => {
    document.getElementById('find').onclick = () => {
      if (word.value.length < 5) throw new Error('String too small.');
      word.value = word.value.substring(0, 5);
      var g = words.map((a) => pattern(a, word.value));
      for (var i = 0; i < 6; i++) {
        var l = words.filter((a,idx1) => g[idx1].every((v, idx2) => v === n[i][idx2]));
        if (l.length === 0) continue;
        else if (l.length === 1) l = l[0];
        else l = l[Math.floor(Math.random() * l.length)];
        [...l].forEach((m, j) => {
          boxes[5 * i + j].innerText = m;
        });
      }
    };
  }).catch(err => console.error("Error loading words:", err));
