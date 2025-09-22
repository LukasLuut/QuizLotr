import React, { useEffect, useRef } from "react";

const PlayerMusica = ({ musica }) => {
  const audioAtualRef = useRef(null);

  const fadeVolume = (audio, targetVolume, step = 0.05, interval = 100) => {
    return new Promise((resolve) => {
      if (!audio) return resolve();

      let fade = setInterval(() => {
        if (!audio) {
          clearInterval(fade);
          return resolve();
        }

        if (Math.abs(audio.volume - targetVolume) < step) {
          audio.volume = targetVolume;
          clearInterval(fade);
          resolve();
        } else {
          audio.volume += (targetVolume - audio.volume) * step;
        }
      }, interval);
    });
  };

  useEffect(() => {
    const antiga = audioAtualRef.current;

    // 👉 Caso especial: se "musica" for null, parar
    if (!musica) {
      if (antiga) {
        fadeVolume(antiga, 0).then(() => {
          antiga.pause();
          antiga.currentTime = 0;
          audioAtualRef.current = null;
        });
      }
      return;
    }

    // cria o novo áudio
    const nova = new Audio(musica);
    nova.volume = 0;
    nova.loop = true;

    try {
      nova.play();
    } catch (err) {
      console.log("Autoplay bloqueado:", err);
    }

    audioAtualRef.current = nova;

    // crossfade: se tinha antiga, fade out dela em paralelo
    if (antiga) {
      fadeVolume(antiga, 0).then(() => {
        antiga.pause();
      });
    }

    // fade in da nova
    fadeVolume(nova, 1);
  }, [musica]);

  return null;
};

export default PlayerMusica;
