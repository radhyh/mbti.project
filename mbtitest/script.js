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
      let pendingAnswer = null;
    function confirmAnswer(choice) {
      document.getElementById("confirmBox").style.display = "none";
      if (choice && pendingAnswer) {
      score[pendingAnswer]++;
      current++;
      showQuestion();
    }
    pendingAnswer = null;
}

btn.onclick = () => {
  pendingAnswer = q.answers[label];
  document.getElementById("confirmText").innerText = `You selected: ${label}. Are you sure?`;
  document.getElementById("confirmBox").style.display = "block";
};

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

  // Save to Firebase
  db.collection('results').add({
    type: mbti,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Save to localStorage and redirect to mind map
  localStorage.setItem("userMBTI", mbti);
  window.location.href = "mbti-map.html";
}
