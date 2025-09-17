import "./PlayQuiz.css";
import exampleImg from "../assets/images/rivendell.webp";
import Map from '../components/Map'
import BoxMap from '../assets/images/map-box.png'
import MapBox from "../components/MapBox";
import bgShire from "../assets/videos/Hobbington.mp4";
import QuizContainer from "../components/layout/QuizContainer";
import { useEffect, useState } from "react";

function Quiz() {

  const [questions, setQuestions] = useState([]);

  let questionNumber = 1;


  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://localhost:3000/questions/${questionNumber}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(data => setQuestions(data))
        .catch(err => console.error("Erro:", err));
    }
    fetchData()
  }, []);

  let pergunta = questions.question
  console.log(questions.answers[0].answer)

  //let opcao1 = questions.answers[0].answer
  // let opcao2 = questions.answers[1].answer
  // let opcao3 = questions.answers[2].answer
  // let opcao4 = questions.answers[3].answer
  //console.log(questions)
  //console.log(questions.answers[0])

  return (

    <div className="quiz-page">
      <QuizContainer pergunta={pergunta}
        opcao1='{opcao1}'
        opcao2='{opcao2}'
        opcao3='{opcao3}'
        opcao4='{opcao4}'
      ></QuizContainer>

      {/* <MapBox ></MapBox> */}


      <video className="bg-video2" autoPlay muted loop playsInline>
        <source src={bgShire} type="video/mp4" />
      </video>
    </div>

  );
}

export default Quiz;