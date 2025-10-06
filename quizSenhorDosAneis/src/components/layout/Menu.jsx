import React, { useState } from 'react'
import './Menu.css'
import bgMenu from '../../assets/images/box/box-lateral.png'
import BtnMenu from '../buttons/BtnMenu'
import { useNavigate } from 'react-router-dom';


function Menu(data, setIsMenuOpen) {
  const [modal, setModal] = useState(true);
  const token = localStorage.getItem("token");

  const scoreZero = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/me/score/zero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          id: data.data.user.id,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar pontuação");
      const resData = await res.json();
      setScore(resData.score);
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  const navigate = useNavigate();

  const handleSair = async () => {
    console.log("ESSE É O HANDLE SAIR: ", data.data.user)

    scoreZero();

    navigate("/Profile", {
      state: {
        user: {
          id: data.data.user.id,
          name: data.data.user.name,
          score: data.data.user.score,
          email: data.data.user.email
        }
      }
    });
  }

  const handleReiniciar = () => {
    scoreZero();

    window.location.reload()
  }

  const handleFecharModal = () => {
    setModal(false);
  }

  const handleSaveProgress = () => {

  }

  return (
    <div>
      {modal && (
      <div className='box-menu'>
      <img className='img-box-menu' src={bgMenu} alt="" />
      <h1>Menu</h1>
      <div className='box-btn'>
        <BtnMenu handleFecharModal={handleFecharModal} texto='Continuar'></BtnMenu>
        <BtnMenu handleReiniciar={handleReiniciar} texto='Reiniciar'></BtnMenu>
        <BtnMenu texto='Salvar'></BtnMenu>
        <BtnMenu handleSair={handleSair} texto='Sair'></BtnMenu>
      </div>

    </div>
    )}
    </div>
    
    
  )
}

export default Menu