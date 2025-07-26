import { useEffect, useState } from "react";
import questions from "./questions";

function App() {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, surrendered: 0 });

  // Load progress from localStorage
  useEffect(() => {
    const savedIndex = localStorage.getItem("quizIndex");
    const savedScore = localStorage.getItem("quizScore");

    if (savedIndex) setIndex(Number(savedIndex));
    if (savedScore) setScore(JSON.parse(savedScore));
  }, []);

  // Save progress to localStorage whenever index or score changes
  useEffect(() => {
    localStorage.setItem("quizIndex", index);
    localStorage.setItem("quizScore", JSON.stringify(score));
  }, [index, score]);

  const currentQuestion = questions[index];

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    if (trimmedAnswer === correctAnswer) {
      if (revealed) {
        nextQuestion(); // jika sudah menyerah, langsung lanjut
      } else {
        setScore({ ...score, correct: score.correct + 1 }); // jawab benar tanpa menyerah
        nextQuestion();
      }
    } else {
      setError("Jawaban salah. Coba lagi.");
    }
  };



const handleSurrender = () => {
  if (!revealed) {
    setRevealed(true);
    setError("Jawaban sudah ditampilkan. Ketikkan jawaban yang benar untuk lanjut.");
    setScore({ ...score, surrendered: score.surrendered + 1 });
  }
};

  const nextQuestion = () => {
    setError("");
    setUserAnswer("");
    setRevealed(false);
    setIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const prevQuestion = () => {
    setError("");
    setUserAnswer("");
    setRevealed(false);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const resetProgress = () => {
    if (confirm("Yakin ingin mengulang semua soal dari awal?")) {
      setIndex(0);
      setScore({ correct: 0, surrendered: 0 });
      setUserAnswer("");
      setError("");
      setRevealed(false);
      localStorage.removeItem("quizIndex");
      localStorage.removeItem("quizScore");
    }
  };

  return (
    <div style={styles.container}>
      <h1>English Verb Quiz</h1>

      <div style={styles.score}>
        ✅ Benar: {score.correct} &nbsp; | &nbsp; ❌ Menyerah: {score.surrendered}
      </div>

      <button onClick={resetProgress} style={styles.resetButton}>
        🔄 Reset Progress
      </button>

      {index < questions.length ? (
        <div style={styles.card}>
          <h2 style={styles.question}>{currentQuestion.word}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Masukkan arti kata"
              style={styles.input}
            />

            <div style={styles.buttons}>
              <button type="submit" style={styles.button}>
                Enter
              </button>
              <button type="button" onClick={handleSurrender} disabled={revealed} style={styles.surrenderButton}>
                Menyerah
              </button>
            </div>
          </form>

          {error && <p style={styles.error}>{error}</p>}
          {revealed && (
            <p style={styles.reveal}>
              Jawaban: <strong>{currentQuestion.answer}</strong>
            </p>
          )}


          <div style={styles.navButtons}>
            <button onClick={prevQuestion} disabled={index === 0} style={styles.navButton}>
              ⬅ Sebelumnya
            </button>
          </div>
        </div>
      ) : (
        <h2>🎉 Kuis selesai! Skor akhir kamu: {score.correct} benar, {score.surrendered} menyerah.</h2>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial",
    backgroundColor: "#f4f4f4",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  score: {
    fontSize: "16px",
    color: "#555",
    marginTop: "10px",
  },
  resetButton: {
    backgroundColor: "#ff9800",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "14px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  question: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  input: {
    width: "80%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "10px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  surrenderButton: {
    padding: "10px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  navButtons: {
    marginTop: "20px",
  },
  navButton: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  reveal: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#333",
  },
  nextButton: {
    marginTop: "10px",
    padding: "8px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#3f51b5",
    color: "white",
    border: "none",
    cursor: "pointer",
  }
};

export default App;
