import './OptionProfile.css'
import React, { useState } from "react";
import BtnMenu from '../buttons/BtnMenu'

function OptionProfile({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

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
            <BtnMenu type="submit" texto="Atualizar" />
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
