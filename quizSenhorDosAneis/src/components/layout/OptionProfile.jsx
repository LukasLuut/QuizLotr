import "./OptionProfile.css";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../buttons/Button";
import Modal from "../Modal";
import TemCerteza from "../TemCerteza";
import PopUpDTO from "../PopUpDTO";
import { useAuth } from "../../context/AuthContext";

/**
 * Modal de edição do cadastro. Só os campos alterados são enviados;
 * a senha só muda se for preenchida.
 */
function OptionProfile({ isOpen, onClose }) {
  const { user, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const titleId = useId();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [acao, setAcao] = useState(null); // null | "update" | "delete" | "photo"
  const [busy, setBusy] = useState(false);
  const [popup, setPopup] = useState(null); // { message, variant }

  // Ao abrir, preenche com os dados atuais da sessão
  useEffect(() => {
    if (isOpen && user) setForm({ name: user.name, email: user.email, password: "" });
  }, [isOpen, user]);

  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => setPopup(null), 3000);
    return () => clearTimeout(t);
  }, [popup]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const changes = () => {
    const body = {};
    if (form.name.trim() && form.name.trim() !== user?.name) body.name = form.name.trim();
    if (form.email.trim() && form.email.trim().toLowerCase() !== user?.email) body.email = form.email.trim();
    if (form.password) body.password = form.password;
    return body;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(changes()).length === 0) {
      setPopup({ message: "Nenhuma alteração para salvar.", variant: "info" });
      return;
    }
    setAcao("update");
  };

  const handleConfirm = async () => {
    const current = acao;
    setAcao(null);
    setBusy(true);
    try {
      if (current === "update") {
        await updateUser(changes());
        setForm((prev) => ({ ...prev, password: "" }));
        setPopup({ message: "Cadastro atualizado.", variant: "success" });
      } else if (current === "photo") {
        await updateUser({ avatar: null });
        setPopup({ message: "Foto removida.", variant: "success" });
      } else if (current === "delete") {
        await deleteAccount();
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setPopup({ message: err.message, variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PopUpDTO message={popup?.message} variant={popup?.variant} isOpen={!!popup} />
      <Modal isOpen={isOpen} onClose={onClose} labelledBy={titleId} className="option-profile-bg">
        <h2 id={titleId}>Atualizar Cadastro</h2>

        <form className="option-profile-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="perfil-nome">Nome</label>
            <input id="perfil-nome" name="name" type="text" autoComplete="nickname" value={form.name} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="perfil-email">E-mail</label>
            <input id="perfil-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="perfil-senha">Nova senha</label>
            <input
              id="perfil-senha"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Deixe em branco para manter"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="btn-menu-update-profile">
            <Button type="submit" disabled={busy}>
              Atualizar
            </Button>
            <Button onClick={() => setAcao("delete")} disabled={busy}>
              Excluir conta
            </Button>
          </div>
          {user?.avatar && (
            <button type="button" className="link" onClick={() => setAcao("photo")} disabled={busy}>
              Remover foto de perfil
            </button>
          )}
        </form>

        <button type="button" className="option-profile-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
      </Modal>

      <TemCerteza
        isOpen={acao !== null}
        mensagem={
          acao === "delete"
            ? "Excluir sua conta e todo o seu progresso?"
            : acao === "photo"
              ? "Remover sua foto de perfil?"
              : "Salvar as alterações no cadastro?"
        }
        onConfirm={handleConfirm}
        onCancel={() => setAcao(null)}
      />
    </>
  );
}

export default OptionProfile;
