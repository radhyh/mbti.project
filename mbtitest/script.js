let questions = [];
let current = 0;
let score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let total = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  if (current >= questions.length) return showResult();

  const q = questions[current];
  document.getElementById('question-box').innerText = q.question;
  const btns = document.getElementById('buttons');
  btns.innerHTML = '';

  for (let label in q.answers) {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.onclick = () => {
      const trait = q.answers[label];
      score[trait]++;
      total[trait]++;
      alert(`You selected: ${label}`);
      current++;
      showQuestion();
    };
    btns.appendChild(btn);
  }
}

function showResult() {
  const percentage = {};
  for (let key in score) {
    const pair = key === 'E' ? 'I' : key === 'I' ? 'E' :
                 key === 'S' ? 'N' : key === 'N' ? 'S' :
                 key === 'T' ? 'F' : key === 'F' ? 'T' :
                 key === 'J' ? 'P' : 'J';
    const totalTrait = score[key] + score[pair];
    percentage[key] = totalTrait > 0 ? Math.round((score[key] / totalTrait) * 100) : 0;
  }

  const mbti =
    (score.E >= score.I ? 'E' : 'I') +
    (score.S >= score.N ? 'S' : 'N') +
    (score.T >= score.F ? 'T' : 'F') +
    (score.J >= score.P ? 'J' : 'P');

  alert(`Your MBTI result is: ${mbti}`);

  document.getElementById('question-box').innerText = `Your MBTI: ${mbti}`;
  document.getElementById('buttons').innerHTML = '';
  document.getElementById('result').innerHTML = `
    <p><strong>MBTI Result:</strong> ${mbti}</p>
    <p><strong>Scores:</strong></p>
    <ul>
      <li>E: ${percentage.E}%</li>
      <li>I: ${percentage.I}%</li>
      <li>S: ${percentage.S}%</li>
      <li>N: ${percentage.N}%</li>
      <li>T: ${percentage.T}%</li>
      <li>F: ${percentage.F}%</li>
      <li>J: ${percentage.J}%</li>
      <li>P: ${percentage.P}%</li>
    </ul>
  `;

  saveToFirebase(mbti);
  showMatch(mbti);
}

function saveToFirebase(type) {
  db.collection('results').add({
    type: type,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function showMatch(type) {
  const matches = {
    'INFJ': { best: 'ENFP', worst: 'ESTP' },
    'ENFP': { best: 'INFJ', worst: 'ISTJ' },
    'ISTJ': { best: 'ESFP', worst: 'ENFP' },
    'ENTP': { best: 'INFJ', worst: 'ISFJ' },
    'ESTP': { best: 'ISFJ', worst: 'INFJ' }
  };

  const result = matches[type] || { best: "Unknown", worst: "Unknown" };
  document.getElementById('result').innerHTML += `
    <p><strong>Perfect Match:</strong> ${result.best}</p>
    <p><strong>Disaster Match:</strong> ${result.worst}</p>
  `;
}
