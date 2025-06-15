let questions = [];
let current = 0;
let score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let pendingAnswer = null;
let username = "";  // <-- add this if you get user name from form

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
  });

function startTest() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name.");
    return;
  }

  document.getElementById("user-form").style.display = "none";
  document.getElementById("question-box").style.display = "block";
  document.getElementById("buttons").style.display = "block";
  document.getElementById("result").style.display = "block";

  current = 0;
  score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  showQuestion(); // show the question after name is entered
}
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
      pendingAnswer = {
        dimension: q.answers[label],
        label: label
      };
      document.getElementById("confirmText").innerText = `You selected: "${label}". Are you sure?`;
      document.getElementById("confirmBox").style.display = "block";
    };
    btns.appendChild(btn);
  }
}

function confirmAnswer(confirmed) {
  document.getElementById("confirmBox").style.display = "none";
  if (confirmed && pendingAnswer) {
    score[pendingAnswer.dimension]++;
    current++;
    showQuestion();
  }
  pendingAnswer = null;
}

function showResult() {
  const mbti =
    (score.E > score.I ? 'E' : 'I') +
    (score.S > score.N ? 'S' : 'N') +
    (score.T > score.F ? 'T' : 'F') +
    (score.J > score.P ? 'J' : 'P');

  const scoreText = getScorePercent();

  //Show result in alert 
  alert(`Your MBTI: ${mbti}`);


  // Call saveToFirebase here with MBTI and username
  saveToFirebase(mbti);

  document.getElementById('question-box').innerText = `Your MBTI: ${mbti}`;
  document.getElementById('buttons').innerHTML = '';
  document.getElementById('result').innerHTML = `
    <h2>Your MBTI: ${mbti}</h2>
    <div style="white-space: pre-line; font-family: monospace;">${scoreText}</div>
  `;
}

function saveToFirebase(mbti) {
  db.collection('results').add({
    name: username,          // make sure username is set somewhere before test starts
    type: mbti,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('Result saved successfully');
  })
  .catch(err => {
    console.error('Error saving result:', err);
  });
}

function getScorePercent() {
  const result = [];
  const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];
  for (let [a, b] of pairs) {
    const total = score[a] + score[b];
    if (total === 0) continue;
    const percentA = Math.round((score[a] / total) * 100);
    const percentB = 100 - percentA;
    result.push(`${a}: ${percentA}%, ${b}: ${percentB}%`);
  }
  return result.join('<br>');
}
