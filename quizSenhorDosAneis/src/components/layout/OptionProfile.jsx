import './OptionProfile.css'
import React, { useState } from "react";
import BtnMenu from '../buttons/BtnMenu'
import { Navigate, useNavigate } from 'react-router-dom';

function OptionProfile({ isOpen, onClose, onSubmit, id }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const idUser = id;
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

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
          "Authorization": "Bearer " + token, // Corrigido: "Content-Type", não "content-Type"
        },
        body: JSON.stringify(body),
      });

      if(!res.ok) {
        console.log(res)
        throw new Error;
      }

      const data = await res.json();
      alert("Usuário atualizado com sucesso")
    
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const handleDeletarClick = async () => {
    const id = idUser;
    const token = localStorage.getItem("token");

    const confirm = window.confirm("Tem certeza que deseja excluir?");

    if(!confirm) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token, // Corrigido: "Content-Type", não "content-Type"
        },
        body: JSON.stringify({ id })
      });

      if(!res.ok) {
        console.log(res)
        throw new Error;
      }

      const data = await res.json();
      alert("Usuário deletado com sucesso")

      localStorage.removeItem("token")
      setTimeout(() => navigate("/Login", { replace: true }), 2500);
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    if (onSubmit) {
      onSubmit(form); // manda os dados pro pai
    }
    onClose(); // fecha o modal
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="option-profile-bg" onClick={(e) => e.stopPropagation()}>
        <h2>Atualizar Cadastro</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name">Nome</label>
            <br />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Frodo"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Ex: frodo@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Senha</label>
            <br />
            <input
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

          <div className="btn-menu-update-profile" style={{ marginTop: 12 }}>
            <BtnMenu type="submit" texto="Atualizar" handleAtualizarClick={handleAtualizarClick}/>
            <BtnMenu type="submit" texto="Deletar" handleDeletarClick={handleDeletarClick}/>
          </div>
        </form>

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
