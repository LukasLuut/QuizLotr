// Camada única de acesso à API. Nenhum componente chama fetch direto.
// A URL vem de VITE_API_URL (ver .env.example).
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const TOKEN_KEY = "token";

// localStorage pode falhar (janela anônima, armazenamento bloqueado)
export const tokenStore = {
  get() {
    try {
      const value = localStorage.getItem(TOKEN_KEY);
      return value && value !== "undefined" && value !== "null" ? value : null;
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* sem armazenamento: a sessão dura só enquanto a página estiver aberta */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* nada a limpar */
    }
  },
};

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const FALLBACK_MESSAGES = {
  400: "Dados inválidos.",
  401: "Sessão expirada. Entre novamente.",
  403: "Acesso negado.",
  404: "Não encontrado.",
  409: "Esta ação já foi feita.",
  429: "Muitas tentativas. Aguarde alguns minutos.",
  500: "Erro no servidor. Tente novamente em instantes.",
};

// Normaliza qualquer corpo de erro em uma mensagem legível
export function errorMessage(data, status) {
  if (data && typeof data.message === "string" && data.message) return data.message;
  if (Array.isArray(data)) {
    const msgs = data.flatMap((item) => (item && typeof item === "object" ? Object.values(item.constraints || item) : [String(item)]));
    if (msgs.length) return msgs.join(". ");
  }
  if (typeof data === "string" && data.trim()) return data;
  return FALLBACK_MESSAGES[status] || `Erro inesperado (${status}).`;
}

let unauthorizedHandler = null;
// O AuthContext registra aqui o que fazer quando o token expira (401)
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request(path, { method = "GET", body, auth = true, signal } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError(0, "Não foi possível falar com o servidor. Verifique se a API está rodando.");
  }

  const data = await parseBody(res);
  if (!res.ok) {
    const message = errorMessage(data, res.status);
    if (res.status === 401 && auth && token && unauthorizedHandler) unauthorizedHandler(message);
    throw new ApiError(res.status, message, data?.details);
  }
  return data;
}

export const api = {
  register: (data) => request("/auth/register", { method: "POST", body: data, auth: false }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password }, auth: false }),

  me: () => request("/users/me"),
  updateMe: (data) => request("/users/me", { method: "PUT", body: data }),
  deleteMe: () => request("/users/me", { method: "DELETE" }),
  achievements: () => request("/users/me/achievements"),

  startRound: (mode = "normal", journey = "main") => request("/rounds", { method: "POST", body: { mode, journey } }),
  currentRound: () => request("/rounds/current"),
  roundState: (id) => request(`/rounds/${id}`),
  question: (id, signal) => request(`/rounds/${id}/question`, { signal }),
  answer: (id, questionId, answerId, useRing = false) =>
    request(`/rounds/${id}/answer`, { method: "POST", body: { questionId, answerId, useRing } }),
  help: (id, help) => request(`/rounds/${id}/help`, { method: "POST", body: { help } }),
  pause: (id) => request(`/rounds/${id}/pause`, { method: "POST" }),
  resume: (id) => request(`/rounds/${id}/resume`, { method: "POST" }),
  abandon: (id) => request(`/rounds/${id}/abandon`, { method: "POST" }),
  summary: (id) => request(`/rounds/${id}/summary`),
  ranking: (mode = "normal", period = "all", signal) =>
    request(`/rounds/ranking?mode=${encodeURIComponent(mode)}&period=${encodeURIComponent(period)}`, { auth: false, signal }),
};
