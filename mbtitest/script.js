// Firebase config first
const firebaseConfig = {
  apiKey: "AIzaSyBTUI2nTJCAr4xn0FYaa6SGV9xbaKsK1kg",
  authDomain: "mbti-project-3c324.firebaseapp.com",
  projectId: "mbti-project-3c324",
  storageBucket: "mbti-project-3c324.appspot.com",
  messagingSenderId: "539055979955",
  appId: "1:539055979955:web:078e6481299a75b3735fc6"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const compatibilityMap = {
  INFP: {
    love: "ENFJ",
    friendship: "INFJ",
    work: "INTJ",
    disaster: "ESTJ"
  },
  INFJ: {
    love: "ENFP",
    friendship: "INFP",
    work: "ENTP",
    disaster: "ESTP"
  },
  ENFP: {
    love: "INFJ",
    friendship: "ENFP",
    work: "INTJ",
    disaster: "ISTJ"
  },
  ENFJ: {
    love: "INFP",
    friendship: "ENFJ",
    work: "INTP",
    disaster: "ISTP"
  },
  INTP: {
    love: "ENTJ",
    friendship: "INTP",
    work: "INFJ",
    disaster: "ESFJ"
  },
  INTJ: {
    love: "ENFP",
    friendship: "INTJ",
    work: "ENFP",
    disaster: "ESFP"
  },
  ENTP: {
    love: "INFJ",
    friendship: "ENTP",
    work: "INTJ",
    disaster: "ISFJ"
  },
  ENTJ: {
    love: "INFP",
    friendship: "ENTJ",
    work: "INTP",
    disaster: "ISFP"
  },
  ISFP: {
    love: "ESTJ",
    friendship: "ISFP",
    work: "ESFP",
    disaster: "ENTJ"
  },
  ISTP: {
    love: "ESFJ",
    friendship: "ISTP",
    work: "ESTP",
    disaster: "ENFJ"
  },
  ESFP: {
    love: "ISFJ",
    friendship: "ESFP",
    work: "ISTP",
    disaster: "INTJ"
  },
  ESTP: {
    love: "ISFJ",
    friendship: "ESTP",
    work: "ISTP",
    disaster: "INFJ"
  },
  ISFJ: {
    love: "ESFP",
    friendship: "ISFJ",
    work: "ESTJ",
    disaster: "ENTP"
  },
  ISTJ: {
    love: "ESFP",
    friendship: "ISTJ",
    work: "ESTJ",
    disaster: "ENFP"
  },
  ESFJ: {
    love: "ISFP",
    friendship: "ESFJ",
    work: "ISTJ",
    disaster: "INTP"
  },
  ESTJ: {
    love: "ISFP",
    friendship: "ESTJ",
    work: "ISTJ",
    disaster: "INFP"
  }
};

let questions = [];
let current = 0;
let score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let pendingAnswer = null;
let username = "";  // <-- add this if you get user name from form

function startTest() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name.");
    return;
  }

  // Fetch questions and only then start the test
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data;

      // Now initialize test AFTER questions loaded
      document.getElementById("user-form").style.display = "none";
      document.getElementById("question-box").style.display = "block";
      document.getElementById("buttons").style.display = "block";
      document.getElementById("result").style.display = "block";

      current = 0;
      score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

      showQuestion(); // Nowthis runs when questions are ready
    })
    .catch(err => {
      alert("Failed to load questions.");
      console.error(err);
    });
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
  const match = compatibilityMap[mbti] || { love: "?", friendship: "?", work: "?", disaster: "?" };

  //Show result in alert 
  alert(`Your MBTI: ${mbti}`);


  // Call saveToFirebase here with MBTI and username
  saveToFirebase(mbti);

  document.getElementById('question-box').innerText = "none";
  document.getElementById('buttons').innerHTML = "none";
  document.getElementById('result').innerHTML = `
  <h2>Your MBTI: ${mbti}</h2>
  <div style="white-space: pre-line; font-family: monospace;">
    ${scoreText}

    💖 Love Match: ${match.love}
    🫶 Friendship Match: ${match.friendship}
    💼 Work Match: ${match.work}
    💥 Disaster Match: ${match.disaster}
  </div>
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
