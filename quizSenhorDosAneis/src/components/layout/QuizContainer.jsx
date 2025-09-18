import React from 'react'
import './QuizContainer.css'
import exampleImg from "../../assets/images/rivendell.webp";
import boxQuestion from "../../assets/images/box-question.png";
import BtnQuestion from '../buttons/btnQuestion';
import Map from '../Map'





function QuizContainer(props) {
  const w = '400px';
  const h = '90px';
  
  let pergunta = props.pergunta
  let opcao1 = props.opcao1;
  let opcao2 = props.opcao2;
  let opcao3 = props.opcao3;
  let opcao4 = props.opcao4;
  
  return (
    <div>

      <div className="quiz-container">
        <h1 className='title-responda'>RespondA</h1>
        <img className='box-question' src={boxQuestion} alt="" />
        {/* Imagem do mapa */}
        <div className="quiz-image">
          <Map path={props.path} />
        </div>

        {/* Pergunta */}
        <h2 className="quiz-question">
          {pergunta}
        </h2>

        {/* Opções */}
        <div className="quiz-options">
          <BtnQuestion w={w} h={h} texto={opcao1} />
          <BtnQuestion w={w} h={h} texto={opcao2} />
          <BtnQuestion w={w} h={h} texto={opcao3} />
          <BtnQuestion w={w} h={h} texto={opcao4} />
        </div>

      </div>

    </div>
  )
}

export default QuizContainer