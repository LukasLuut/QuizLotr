import './OptionProfile.css'
import React, { useState } from "react";
import BtnMenu from '../buttons/BtnMenu'
import { useNavigate } from 'react-router-dom';
import TemCerteza from '../TemCerteza'
import PopUpDTO from '../PopUpDTO';

function OptionProfile({ isOpen, onClose, onSubmit, id }) {
  //  Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // ---------------------------
  //  Estados locais
  // ---------------------------
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [popUpActive, setPopUpActive]=useState(false); // Controlador da apresentação do popUp de confirmação
  const [confirmationMsg, setConfirmationMsg]=useState('')// Controla a mensagem que aparece no popUp
  const idUser = id;
  const navigate = useNavigate();

  // ---------------------------
  //  Funções auxiliares
  // ---------------------------

  // Atualiza estado do form sempre que o usuário digitar
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ---------------------------
  //  PopUp de aviso
  // ---------------------------
  const popUpMsg = (mensagem)=>{
    // Apresentação do popUp de confirmação
      setConfirmationMsg(mensagem);
      setPopUpActive(true);
      setTimeout(()=>{
        setPopUpActive(false);
      },2500)
  }


  // ---------------------------
  //  Atualizar Usuário (PUT)
  // ---------------------------
  const handleAtualizarClick = async () => {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    const token = localStorage.getItem("token");

    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password) body.password = password;

    try {
      const res = await fetch(`http://localhost:3000/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.log(res);
        throw new Error();
      }

      await res.json();

        popUpMsg("Usuário atualizado com sucesso")

    } catch (err) {
      console.error("Erro:", err);
    }
  };

  // ---------------------------
  //  Deletar Usuário (DELETE)
  // ---------------------------
  const handleDeletarClick = async () => {
    const token = localStorage.getItem("token");
    const confirm = window.confirm("Tem certeza que deseja excluir?");

    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/users/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ id: idUser }),
      });

      if (!res.ok) {
        console.log(res);
        throw new Error();
      }

      await res.json();
      popUpMsg("Usuário deletado com sucesso")

      // Remove token e redireciona pro login
      localStorage.removeItem("token");
      setTimeout(() => navigate("/Login", { replace: true }), 2800);
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  // ---------------------------
  //  Submit do Formulário
  // ---------------------------
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    if (onSubmit) {
      onSubmit(form); // envia dados pro pai
    }

    onClose(); // fecha o modal
  }

   // ---------------------------
   // Decide qual ação executar na confirmação do usuário
   // ---------------------------
  const [acao, setAcao] = useState(null); // null | "update" | "delete"
  function handleConfirm() {
    if (acao === "update") {
      handleAtualizarClick();
    } else if (acao === "delete") {
      handleDeletarClick();
    }
    setAcao(null); // fecha modal
  }  

  // ---------------------------
  //  Renderização
  // ---------------------------
  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* PopUp de confirmação de ação */}
      <PopUpDTO erro={confirmationMsg} isOpen={popUpActive}></PopUpDTO>

      <div className="option-profile-bg" onClick={(e) => e.stopPropagation()}>
        <h2>Atualizar Cadastro</h2>

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Nome */}
          <div>
            <label htmlFor="name">Nome</label>
            <br />
            <input
              autoComplete="off"
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Frodo"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              autoComplete="off"
              id="email"
              name="email"
              type="email"
              placeholder="Ex: frodo@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password">Senha</label>
            <br />
            <input
              autoComplete="off"
              id="password"
              name="password"
              type="password"
              placeholder="•••••••••"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {/* Botões */}
          <div className="btn-menu-update-profile" style={{ marginTop: 12 }}>
            <BtnMenu
              type="submit"
              texto="Atualizar"
              handleAtualizarClick={() => setAcao("update")}
            />
            <BtnMenu
              type="button"
              texto="Deletar"
              handleDeletarClick={() => setAcao("delete")}
            />
          </div>
             {/* componente de confirmação */}
          <TemCerteza
            isOpen={acao !== null}
            mensagem={
              acao === "update"? "Tem certeza que deseja atualizar seus dados?": 
              acao === "delete" ? "Tem certeza que deseja excluir sua conta?": ""
              }
            onConfirm={handleConfirm}
            onCancel={() => setAcao(null)}
          />
        </form>

        {/* Debug: mostra dados atuais do form */}
        {submitted && (
          <div style={{ marginTop: 12 }}>
            <strong>Dados atuais:</strong>
            <pre>{JSON.stringify(form, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default OptionProfile;
