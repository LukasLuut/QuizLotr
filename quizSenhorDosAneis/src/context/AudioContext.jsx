/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import clickSound from "../assets/audio/click-song.mp3";
import correctSound from "../assets/audio/sfx/correct-sfx.mp3";
import wrongSound from "../assets/audio/sfx/error-sfx.mp3";
import winSound from "../assets/audio/sfx/win-sfx.mp3";
import whooshSound from "../assets/audio/sfx/whoosh.mp3";

const SFX = { click: clickSound, correct: correctSound, wrong: wrongSound, win: winSound, whoosh: whooshSound };
const MUSIC_LEVEL = 0.6; // música um pouco abaixo dos efeitos
const FADE_MS = 1200;
const STORAGE = { muted: "quizlotr-muted", volume: "quizlotr-volume" };

const readSetting = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
};
const writeSetting = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* preferência só vale nesta sessão */
  }
};

// play() pode lançar (jsdom) ou rejeitar (autoplay bloqueado)
const tryPlay = (audio) => {
  try {
    const p = audio.play();
    return p && typeof p.then === "function" ? p.then(() => true, () => false) : Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
};

const noop = () => {};
const AudioCtx = createContext({ playMusic: noop, playSfx: noop, muted: false, toggleMute: noop, volume: 1, setVolume: noop });

// Um único dono para todo o áudio do jogo: uma música por vez (com crossfade
// cancelável), efeitos pré-carregados, mute e volume persistidos.
export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(() => readSetting(STORAGE.muted, "false") === "true");
  const [volume, setVolumeState] = useState(() => {
    const v = Number(readSetting(STORAGE.volume, "0.8"));
    return Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0.8;
  });

  const settings = useRef({ muted, volume });
  const music = useRef(null); // { audio, src }
  const fades = useRef(new Map()); // audio -> id do intervalo
  const pending = useRef(null); // música que esperou um gesto do usuário (autoplay)
  const sfxBase = useRef(null);

  const musicTarget = () => (settings.current.muted ? 0 : settings.current.volume * MUSIC_LEVEL);

  const cancelFade = (audio) => {
    const id = fades.current.get(audio);
    if (id) clearInterval(id);
    fades.current.delete(audio);
  };

  // Fade linear; um novo fade no mesmo áudio cancela o anterior
  const fade = useCallback((audio, target, ms = FADE_MS, onDone) => {
    cancelFade(audio);
    const start = audio.volume;
    const steps = Math.max(1, Math.round(ms / 50));
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      audio.volume = Math.min(1, Math.max(0, start + ((target - start) * step) / steps));
      if (step >= steps) {
        cancelFade(audio);
        onDone?.();
      }
    }, 50);
    fades.current.set(audio, id);
  }, []);

  const stopAudio = useCallback(
    (audio) =>
      fade(audio, 0, FADE_MS, () => {
        audio.pause();
        audio.removeAttribute("src");
        audio.load?.();
      }),
    [fade]
  );

  const playMusic = useCallback(
    (src) => {
      const current = music.current;
      if (current?.src === src) return;
      if (current) stopAudio(current.audio);
      if (!src) {
        music.current = null;
        return;
      }
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0;
      music.current = { audio, src };
      tryPlay(audio).then((ok) => {
        if (music.current?.audio !== audio) return; // já trocou de música
        if (ok) fade(audio, musicTarget());
        else pending.current = audio;
      });
    },
    [fade, stopAudio]
  );

  const playSfx = useCallback((name, { volume: level = 0.7, offset = 0 } = {}) => {
    if (settings.current.muted || !SFX[name]) return;
    if (!sfxBase.current) sfxBase.current = Object.fromEntries(Object.entries(SFX).map(([k, s]) => [k, new Audio(s)]));
    const sound = sfxBase.current[name].cloneNode();
    sound.volume = Math.min(1, level * settings.current.volume);
    try {
      sound.currentTime = offset;
    } catch {
      /* metadados ainda não carregados */
    }
    tryPlay(sound);
  }, []);

  // Autoplay bloqueado: tenta de novo no primeiro clique ou tecla
  useEffect(() => {
    const resume = () => {
      const audio = pending.current;
      if (!audio || music.current?.audio !== audio) return;
      pending.current = null;
      tryPlay(audio).then((ok) => {
        if (ok) fade(audio, musicTarget());
        else pending.current = audio;
      });
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [fade]);

  // Mudou mute/volume: aplica na música atual e persiste
  useEffect(() => {
    settings.current = { muted, volume };
    writeSetting(STORAGE.muted, muted);
    writeSetting(STORAGE.volume, volume);
    const current = music.current?.audio;
    if (current) {
      cancelFade(current);
      current.volume = musicTarget();
    }
  }, [muted, volume]);

  useEffect(() => {
    const fadeMap = fades.current;
    return () => {
      fadeMap.forEach((id) => clearInterval(id));
      music.current?.audio.pause();
    };
  }, []);

  const value = useMemo(
    () => ({
      playMusic,
      playSfx,
      muted,
      toggleMute: () => setMuted((m) => !m),
      volume,
      setVolume: (v) => setVolumeState(Math.min(Math.max(Number(v) || 0, 0), 1)),
    }),
    [playMusic, playSfx, muted, volume]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export const useAudio = () => useContext(AudioCtx);
