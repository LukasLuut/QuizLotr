import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import bgShire from "../../assets/videos/Hobbington.mp4";
import bgBri from "../../assets/videos/bri.mp4";
import bgRivendel from "../../assets/videos/lorien.mp4";
import bgLorien from "../../assets/videos/lorien.mp4";
import bgMordor from "../../assets/videos/mordor.mp4";
import bgMoria from "../../assets/videos/moria.mp4";
import bgArgonath from "../../assets/videos/argonath.mp4";
import "./VideoTransition.css";

// Lista de vídeos
const allVideos = [
  bgShire,
  bgBri,
  bgRivendel,
  bgMoria,
  bgLorien,
  bgArgonath,
  bgMordor,
];


const VideoTransition = forwardRef(({ fadeDuration = 1500, onChange }, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [fadeClass, setFadeClass] = useState("fade-out");

  useImperativeHandle(ref, () => ({
    nextBg: () => {
      triggerChange((activeIndex + 1) % allVideos.length);
    },
    setBg: (index) => {
      if (index < 0 || index >= allVideos.length) return;
      triggerChange(index);
    },
    getIndex: () => activeIndex,
  }));

  function triggerChange(next) {
    setPrevIndex(activeIndex);
    setActiveIndex(next);
    setAnimating(true);
    if (onChange) onChange(next);

    // truque: espera 1 frame para aplicar fade-in
    setFadeClass("fade-out");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFadeClass("fade-in");
      });
    });
  }

  // fim da animação → remove vídeo antigo
  useEffect(() => {
    if (!animating) return;
    const timer = setTimeout(() => {
      setPrevIndex(null);
      setAnimating(false);
    }, fadeDuration);
    return () => clearTimeout(timer);
  }, [animating, fadeDuration]);

  return (
    <div className="video-transition player-musica">
      {allVideos.map((video, index) => {
        if (index !== activeIndex && index !== prevIndex) return null;
        const isActive = index === activeIndex;
        return (
          <video
            key={index}
            className={`bg-video ${isActive ? fadeClass : "fade-out"}`}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={video} type="video/mp4" />
          </video>
        );
      })}
    </div>
  );
});

export default VideoTransition;