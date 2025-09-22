import './OptionProfile.css'
import React, { useState } from "react";

function OptionProfile() {

 const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit && typeof onSubmit === "function") {
      onSubmit(form);
    } else {
      // fallback: apenas logar no console
      console.log("Form submitted:", form);
    }
  }



  return (
    <div className='option-profile-bg'>
         <h2>Atualizar cadastro</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Nome</label>
          <br />
          <input
            id="name"
            name="name"
            type="text"
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
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Enviar</button>
        </div>
      </form>

      {submitted && (
        <div style={{ marginTop: 12 }}>
          <strong>Dados atuais:</strong>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </div>
      )}

    </div>
  )
}

export default OptionProfile