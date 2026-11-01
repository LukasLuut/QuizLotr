import "./OptionProfile.css";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../buttons/Button";
import Modal from "../Modal";
import TemCerteza from "../TemCerteza";
import PopUpDTO from "../PopUpDTO";
import Avatar from "../Avatar";
import PersonaGrid from "../PersonaGrid";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { DEFAULT_PERSONA, PERSONAS } from "../../config/personas";

/**
 * Modal de edição do cadastro: foto, título (das conquistas desbloqueadas), nome,
 * e-mail e senha. Só os campos alterados são enviados; a senha só muda se for preenchida.
 * A foto é salva assim que escolhida.
 */
function OptionProfile({ isOpen, onClose }) {
  const { user, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const titleId = useId();

  const [form, setForm] = useState({ name: "", email: "", password: "", titleCode: "" });
  const [titles, setTitles] = useState([]); // conquistas desbloqueadas
  const [pickerOpen, setPickerOpen] = useState(false); // quadro com os personagens
  const pickerTitleId = useId();
  const [acao, setAcao] = useState(null); // null | "update" | "delete"
  const [busy, setBusy] = useState(false);
  const [popup, setPopup] = useState(null); // { message, variant }

  // Ao abrir, preenche com os dados atuais da sessão
  useEffect(() => {
    if (isOpen && user) setForm({ name: user.name, email: user.email, password: "", titleCode: user.titleCode ?? "" });
  }, [isOpen, user]);

  // Títulos disponíveis = conquistas já desbloqueadas
  useEffect(() => {
    if (!isOpen) return;
    let alive = true;
    api
      .achievements()
      .then((list) => alive && setTitles(list.filter((a) => a.unlocked)))
      .catch(() => alive && setTitles([]));
    return () => {
      alive = false;
    };
  }, [isOpen]);

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
    if ((form.titleCode || null) !== (user?.titleCode ?? null)) body.titleCode = form.titleCode || null;
    return body;
  };

  // Foto: escolher um personagem salva na hora
  const choosePersona = async (code) => {
    if (busy || code === (user?.avatar || DEFAULT_PERSONA)) return;
    setBusy(true);
    try {
      await updateUser({ avatar: code });
      setPickerOpen(false);
      setPopup({ message: "Foto de perfil atualizada.", variant: "success" });
    } catch (err) {
      setPopup({ message: err.message, variant: "error" });
    } finally {
      setBusy(false);
    }
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
          {/* Identidade: foto atual (clique para trocar) e título exibido no quiz */}
          <div className="profile-identity">
            <button
              type="button"
              className="identity-avatar"
              onClick={() => setPickerOpen(true)}
              disabled={busy}
              aria-label="Trocar foto de perfil"
              title="Trocar foto de perfil"
            >
              <Avatar persona={user?.avatar} name={user?.name} />
              <span className="identity-avatar-hint" aria-hidden="true">
                Trocar foto
              </span>
            </button>

            <div className="field identity-title">
              <label htmlFor="perfil-titulo">Título</label>
              <select id="perfil-titulo" name="titleCode" value={form.titleCode} onChange={handleChange}>
                <option value="">Viajante do Condado</option>
                {titles.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.title}
                  </option>
                ))}
              </select>
              <span className="identity-hint">
                {titles.length === 0 ? "Desbloqueie conquistas para ganhar novos títulos." : "Títulos vêm das suas conquistas."}
              </span>
            </div>
          </div>

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
        </form>
      </Modal>

      {/* Quadro de escolha da foto: só os personagens disponíveis */}
      <Modal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} labelledBy={pickerTitleId} overlayClassName="persona-overlay" className="persona-modal persona-modal--profile">
        <h2 id={pickerTitleId}>Escolha seu personagem</h2>
        <p className="persona-hint">Nível do viajante {user?.level ?? 0}. Cada personagem traz duas habilidades; novos personagens abrem com as conquistas.</p>
        <PersonaGrid
          personas={PERSONAS}
          level={user?.level ?? 0}
          selected={user?.avatar || DEFAULT_PERSONA}
          onPick={choosePersona}
          disabled={busy}
          labelledBy={pickerTitleId}
        />
      </Modal>

      <TemCerteza
        isOpen={acao !== null}
        mensagem={acao === "delete" ? "Excluir sua conta e todo o seu progresso?" : "Salvar as alterações no cadastro?"}
        onConfirm={handleConfirm}
        onCancel={() => setAcao(null)}
      />
    </>
  );
}

export default OptionProfile;
