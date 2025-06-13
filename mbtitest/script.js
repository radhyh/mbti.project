let questions = [];
let current = 0;
let score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

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
      const confirmAnswer = confirm(`Are you sure you want to select: "${label}"?`);
      if (confirmAnswer) {
        alert(`Answer confirmed: ${label}`);
        score[q.answers[label]]++;
        current++;
        showQuestion();
      } else {
        alert("Answer cancelled. Please choose again.");
      }
    };
    btns.appendChild(btn);
  }
}

function showResult() {
  const mbti = 
    (score.E > score.I ? 'E' : 'I') +
    (score.S > score.N ? 'S' : 'N') +
    (score.T > score.F ? 'T' : 'F') +
    (score.J > score.P ? 'J' : 'P');

  alert(`Your MBTI result is: ${mbti}`);
  document.getElementById('question-box').innerText = `Your MBTI: ${mbti}`;
  document.getElementById('buttons').innerHTML = '';
  document.getElementById('result').innerHTML = `<p><strong>Your MBTI:</strong> ${mbti}</p><p>Score: ${JSON.stringify(score)}</p>`;
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
    <p><strong>Best Match:</strong> ${result.best}</p>
    <p><strong>Disaster Match:</strong> ${result.worst}</p>
  `;
}
