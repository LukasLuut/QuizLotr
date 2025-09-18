import "./PlayQuiz.css";
import exampleImg from "../assets/images/rivendell.webp";
import Map from '../components/Map'
import BoxMap from '../assets/images/map-box.png'
import MapBox from "../components/MapBox";
import bgShire from "../assets/videos/Hobbington.mp4";
import QuizContainer from "../components/layout/QuizContainer";
import React, { useEffect, useState } from "react";
import MovingCharacter from '../components/Map'


function Quiz() {

 

  const [questions, setQuestions] = useState([]);

  let questionNumber = 3;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     fetch(`http://localhost:3000/questions/${questionNumber}`, {
  //       method: "GET"
  //     })
  //       .then(res => res.json())
  //       .then(data => setQuestions(data))
  //       .catch(err => console.error("Erro:", err));
  //   }
  //   fetchData()
  // }, []);

  // // Verifique se 'questions' tem dados antes de tentar acessar a resposta
  // let pergunta = questions.question;
  // let opcao1, opcao2, opcao3, opcao4;


  // if (questions.answers && questions.answers.length > 0) {
  //   opcao1 = questions.answers[0].answer;
  //   opcao2 = questions.answers[1]?.answer; // Usando o optional chaining (?.) para evitar erro se answers[1] não existir
  //   opcao3 = questions.answers[2]?.answer;
  //   opcao4 = questions.answers[3]?.answer;
  // }
  
  
  // let teste = paths.bri

  //const [caminho, setCaminho] = React.useEffect("bri");


  // useEffect(() => {
  //     if(1 > 0) setCaminho("moria")
  // }, []);

  return (
    <div className="quiz-page">
      <QuizContainer
        path='bri'
        pergunta='{pergunta}'
        opcao1='{opcao1}  '
        opcao2='{opcao2}'
        opcao3='{opcao3}'
        opcao4='{opcao4}'
      ></QuizContainer>

      <video className="bg-video2" autoPlay muted loop playsInline>
        <source src={bgShire} type="video/mp4" />
      </video>
    </div>
  );
}

export default Quiz;
