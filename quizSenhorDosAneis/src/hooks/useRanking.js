import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";

const REFRESH_MS = 20000;

// Ranking do modo, atualizado a cada 20 s e quando `refreshKey` muda (ex.: fim da partida).
// Um único intervalo, sempre limpo ao desmontar.
export function useRanking(mode = "normal", { period = "all", refreshKey } = {}) {
  const [state, setState] = useState({ entries: [], status: "loading", error: null });
  const controller = useRef(null);

  const load = useCallback(async () => {
    controller.current?.abort();
    const c = new AbortController();
    controller.current = c;
    try {
      const entries = await api.ranking(mode, period, c.signal);
      setState({ entries, status: "ready", error: null });
    } catch (err) {
      if (err.name !== "AbortError") setState((s) => ({ ...s, status: "error", error: err.message }));
    }
  }, [mode, period]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      clearInterval(id);
      controller.current?.abort();
    };
  }, [load, refreshKey]);

  return state;
}
