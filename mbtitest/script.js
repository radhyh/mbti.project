// Stores the ideal MBTI matches for each type
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
//Declare global variables
let questions = []; // stores all the MBTI questions (fetched from JSON file).
let current = 0; // keeps track of which question number is showing.
let score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }; // keeps count of how many times each trait is selected
let pendingAnswer = null; // temporarily stores an answer waiting for confirmation
let username = "";  // <-- stores the name the user typed in the form and declared globally so it can be accessed in both startTest() and showResult().

function startTest() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name.");
    return;
  }

  // Fetch questions and only then start the test
  fetch("questions.json")
    .then(res => res.json()) 
    // then() runs after the fetch is successful.
    // res.json() will replace the format of response from json to usable javascript array.
    .then(data => {
      questions = data; //assign it to the global variable questions

      // Show question section and hide name form
      document.getElementById("user-form").style.display = "none";
      document.getElementById("question-box").style.display = "block";
      document.getElementById("buttons").style.display = "block";
      document.getElementById("result").style.display = "block";

      current = 0;
      score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }; //Reset all scores to zero (so every new user starts fresh).

      showQuestion(); // Now this runs when questions are ready
    })
    .catch(err => {
      alert("Failed to load questions.");
      console.error(err);
    });
}

function showQuestion() {
  document.getElementById("question-box").style.display = "block";
  document.getElementById("buttons").style.display = "block";

  if (current >= questions.length) return showResult(); // if all questions are answered, show the result.

  const q = questions[current];
  document.getElementById('question-box').innerText = q.question;
  const btns = document.getElementById('buttons'); //btns is the container for the answer buttons.
  btns.innerHTML = ''; // clears any old buttons from the previous question before adding new ones

  for (let label in q.answers) {
    const btn = document.createElement('button'); //Creates a new button element in JavaScript
    btn.innerText = label; //label as agree or disagree
    btn.onclick = () => {
      pendingAnswer = {
        dimension: q.answers[label], //pendingAnswer.dimension stores the MBTI letter (`E`, `I`, etc.)
        label: label //pendingAnswer.label stores the actual label clicked ("Agree" or "Disagree")
      };
      document.getElementById("confirmText").innerText = `You selected: "${label}". Are you sure?`;
      document.getElementById("confirmBox").style.display = "block";
    };
    btns.appendChild(btn); //created new button inside the area on the page reserved for <div id="buttons"></div>
  }
}

function confirmAnswer(confirmed) {
  document.getElementById("confirmBox").style.display = "none"; //Hides the confirmation box
  if (confirmed && pendingAnswer) { //If the user clickes "OK"
    score[pendingAnswer.dimension]++; //It adds a point to the selected trait.
    current++; //Goes to the next question.
    showQuestion();
  }
  pendingAnswer = null; //reset to null to clear it
}

function showResult() {
  document.getElementById("question-box").style.display = "none";
  document.getElementById("buttons").style.display = "none";
  document.getElementById("confirmBox").style.display = "none";
  
  const mbti =
    (score.E > score.I ? 'E' : 'I') +
    (score.S > score.N ? 'S' : 'N') +
    (score.T > score.F ? 'T' : 'F') +
    (score.J > score.P ? 'J' : 'P');

  const scoreText = getScorePercent();

  //find the match from compatibilityMap using the user's MBTI type. If it exists, use it. If it does NOT exist, use the default values: ?.
  const match = compatibilityMap[mbti] || { love: "?", friendship: "?", work: "?", disaster: "?" };

  //Show result in alert 
  alert(`Your MBTI: ${mbti}`);


  // Call saveToFirebase here with MBTI and username
  saveToFirebase(mbti, username);

  document.getElementById('result').innerHTML = `
  <h2>Your MBTI: ${mbti}</h2>
  <div style="white-space: pre-line; font-family: monospace;">
    ${scoreText}

    💖 Love Match: ${match.love}
    🫶 Friendship Match: ${match.friendship}
    💼 Work Match: ${match.work}
    💥 Disaster Match: ${match.disaster}
  </div>
  <div style="margin-top: 20px;">
    <a href="dashboard.html">
    <button style="background-color: #28a745;">View All Results</button>
    </a>
  </div>
`;
}

function saveToFirebase(mbti, username) {
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
  const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]; //Compares each pair of traits 
  for (let [a, b] of pairs) {
    const total = score[a] + score[b];
    if (total === 0) continue;
    const percentA = Math.round((score[a] / total) * 100);
    const percentB = 100 - percentA;
    result.push(`${a}: ${percentA}%, ${b}: ${percentB}%`);
  }
  return result.join('<br>'); //Taking multiple percentage results and combining them into one text block (with line breaks) to display nicely on the result page.
}
