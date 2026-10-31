/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, onUnauthorized, tokenStore } from "../services/api";

const AuthContext = createContext(null);

// Sessão do jogador: o usuário vem sempre de GET /users/me, então F5 em qualquer
// rota reidrata a sessão a partir do token (nada depende de location.state).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (tokenStore.get() ? "loading" : "anonymous"));
  const [notice, setNotice] = useState(null);

  const logout = useCallback((message) => {
    tokenStore.clear();
    setUser(null);
    setStatus("anonymous");
    setNotice(typeof message === "string" ? message : null);
  }, []);

  // Token expirado em qualquer chamada: limpa a sessão e avisa na tela de login
  useEffect(() => onUnauthorized(() => logout("Sua sessão expirou. Entre novamente.")), [logout]);

  useEffect(() => {
    if (!tokenStore.get()) return;
    let alive = true;
    api
      .me()
      .then((me) => {
        if (!alive) return;
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        if (alive) logout();
      });
    return () => {
      alive = false;
    };
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    if (!data?.token) throw new Error("Resposta de login sem token.");
    tokenStore.set(data.token);
    setUser(data.user);
    setStatus("authenticated");
    setNotice(null);
    return data.user;
  }, []);

  const register = useCallback((data) => api.register(data), []);

  const updateUser = useCallback(async (data) => {
    const updated = await api.updateMe(data);
    setUser(updated);
    return updated;
  }, []);

  const deleteAccount = useCallback(async () => {
    await api.deleteMe();
    logout();
  }, [logout]);

  const refreshUser = useCallback(async () => {
    const me = await api.me();
    setUser(me);
    return me;
  }, []);

  const value = useMemo(
    () => ({ user, status, notice, clearNotice: () => setNotice(null), login, logout, register, updateUser, deleteAccount, refreshUser }),
    [user, status, notice, login, logout, register, updateUser, deleteAccount, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}

// Para testes: injeta um valor de sessão sem chamar a API
export const AuthTestProvider = ({ value, children }) => <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
