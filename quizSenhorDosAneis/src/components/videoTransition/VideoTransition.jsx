import { useEffect, useState } from "react";
import { REGIONS } from "../../config/regions";
import "./VideoTransition.css";

/**
 * Fundo da região atual com crossfade. O fundo novo só aparece quando o vídeo
 * já pode tocar (onCanPlay); se o vídeo falhar, fica a imagem de capa (poster).
 * Com prefers-reduced-motion, mostra só a capa, sem vídeo em loop.
 */
function VideoTransition({ index = 0, fadeDuration = 1500 }) {
  const [layers, setLayers] = useState([{ index, key: 0, ready: false }]);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Nova região: empilha o fundo novo sobre o antigo
  useEffect(() => {
    setLayers((prev) => {
      if (prev[prev.length - 1]?.index === index) return prev;
      return [...prev.slice(-1), { index, key: (prev[prev.length - 1]?.key ?? 0) + 1, ready: false }];
    });
  }, [index]);

  // Depois do fade, remove o fundo antigo
  const top = layers[layers.length - 1];
  useEffect(() => {
    if (layers.length < 2 || !top.ready) return;
    const t = setTimeout(() => setLayers((prev) => prev.slice(-1)), fadeDuration);
    return () => clearTimeout(t);
  }, [layers.length, top.ready, fadeDuration]);

  const markReady = (key) => setLayers((prev) => prev.map((l) => (l.key === key ? { ...l, ready: true } : l)));

  return (
    <div className="video-transition" aria-hidden="true" style={{ "--fade-duration": `${fadeDuration}ms` }}>
      {layers.map((layer) => {
        const bg = REGIONS[layer.index]?.background;
        if (!bg) return null;
        const visible = layer.ready || layers.length === 1;
        const className = `bg-video-transition-video ${visible ? "fade-in-transition-video" : "fade-out-transition-video"}`;

        if (bg.type === "image" || reducedMotion) {
          const src = bg.type === "image" ? bg.src : bg.poster;
          return <img key={layer.key} className={className} src={src} alt="" onLoad={() => markReady(layer.key)} onError={() => markReady(layer.key)} />;
        }

        return (
          <video
            key={layer.key}
            className={className}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={bg.poster}
            onCanPlay={() => markReady(layer.key)}
            onError={() => markReady(layer.key)}
          >
            <source src={bg.src} type="video/mp4" />
          </video>
        );
      })}
    </div>
  );
}

export default VideoTransition;
