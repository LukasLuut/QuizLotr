import React from 'react'
import './BtnQuestion.css'
import btnQuestionMarrom from '../../assets/images/button/btn-marrom-2.png'
import btnQuestionDourado from '../../assets/images/button/btn-dourado-2.png'

function BtnQuestion(props) {
  return (
    <button style={{ width: props.w, height: props.h }} className='btn-question'>
        <p className='txt-btn-question'>{props.texto}</p>
        <img className='btn-question-bg' src={btnQuestionMarrom} alt="" />
        <img className='btn-question-bg-2' src={btnQuestionDourado} alt="" />
    
    </button>
  )
}

export default BtnQuestion