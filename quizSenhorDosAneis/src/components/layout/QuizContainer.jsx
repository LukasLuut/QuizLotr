import React from 'react'
import './QuizContainer.css'
import exampleImg from "../../assets/images/rivendell.webp";
import boxQuestion from "../../assets/images/box-question.png";
import BtnQuestion from '../buttons/btnQuestion';
import Map from '../Map'




function QuizContainer(props) {


   



    const w='400px';
    const h='90px';
    let pergunta='Quem foi o portador do Um Anel até o Monte da Perdição?';
    let opcao1='Frodo Bolseiro';
    let opcao2='Frodo Bolseiro';
    let opcao3='Frodo Bolseiro';
    let opcao4='Frodo Bolseiro';
  return (
     <div>
        
          <div className="quiz-container">
            <h1 className='title-responda'>RespondA</h1>
            <img className='box-question' src={boxQuestion} alt="" />
            {/* Imagem ilustrativa */}
            <div className="quiz-image">
              <Map/>
            </div>
    
            {/* Pergunta */}
            <h2 className="quiz-question">
              {pergunta}
            </h2>
    
            {/* Opções */}
            <div className="quiz-options">                
                <BtnQuestion w={w} h={h} texto={opcao1}/>
                <BtnQuestion w={w} h={h} texto={opcao2}/>
                <BtnQuestion w={w} h={h} texto={opcao3}/>
                <BtnQuestion w={w} h={h} texto={opcao4}/>
            </div>
            
          </div> 
          
    </div>
  )
}

export default QuizContainer