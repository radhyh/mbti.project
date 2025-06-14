let questions = [];
let current = 0;
let score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let pendingAnswer = null;

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
      pendingAnswer = {
        dimension: q.answers[label], // like "E", "I"
        label: label                 // like "Agree", "Disagree"
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

  alert(`Your MBTI result is: ${mbti}`);

  // Save result to Firebase
  db.collection('results').add({
    type: mbti,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Pass result to mbti-map.html
  localStorage.setItem("userMBTI", mbti);
  window.location.href = "mbti-map.html";
}
