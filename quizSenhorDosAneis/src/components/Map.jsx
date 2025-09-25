import { MapContainer, ImageOverlay, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapImage from "../assets/images/map.webp";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import './Map.css'



// 🔹 Importe o plugin MovingMarker manualmente
import "../public/plugins/leaflet-moving-maker/MovingMarker"; // coloque o arquivo MovingMarker.js em public/plugins/

// Ícones customizados
import mordorIconUrl from "../assets/icons/mordor.png";
import shireIconUrl from "../assets/icons/Map Icons/House.png";
import rivendellIconUrl from "../assets/icons/rivendell.png";
import BtnQuestion from "./buttons/btnQuestion";

// Ícone provisório do bonequinho
const characterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448615.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

export default function MapaTerraMedia({ ativo, onMoving, onFinish }) {
  const bounds = [
    [0, 0],
    [4344, 5000],
  ];



  const shireIcon = new L.Icon({
    iconUrl: shireIconUrl,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -40],
  });



  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      maxBounds={bounds}
      maxBoundsViscosity={1} // impede arrastar além da borda
      style={{ height: "100%", width: "100%" }}
      minZoom={-2.5}
      center={[3185, 1595]}
      zoom={0}
      zoomControl={false}
      attributionControl={false}
    >
      <ImageOverlay url={mapImage} bounds={bounds} zIndex={1} />

      <IntroZoom></IntroZoom>
      {/* Bonequinho animado */}
      <MovingCharacter ativo={ativo} onMoving={onMoving} onFinish={onFinish} />

      {/* Marcadores temáticos */}
      <Marker position={[3210, 1520]} icon={shireIcon}>
        <Popup>Hobbington: “Lar dos Hobbits...”</Popup>
      </Marker>




    </MapContainer>
  );
}

export function IntroZoom() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // começa no zoomOut máximo
    map.setView([2200, 2500], -2.5, { animate: false });

    // animação de zoom suave até o ponto
    setTimeout(() => {
      map.flyTo([3185, 1485], -1, {
        duration: 7, // maior duração = mais suave
        easeLinearity: 0.25 // controla suavidade
      });
    }, 500);
  }, [map]);

  return null;
}


export function MovingCharacter({ ativo, startZoom = 0.2, endZoom = -1, onMoving, onFinish }) {
  const map = useMap();
  const [routeIndex, setRouteIndex] = useState(0);
  const markerRef = useRef(null);

  const paths = [
    [[3185, 1485]], // 0 - init

    [[3185, 1485], [3133, 1497], [3110, 1544], [3126, 1614],
    [3169, 1674], [3158, 1752], [3182, 1797]], // 1 - bri

    [[3182, 1797], [3218, 1832], [3196, 1906], [3217, 1977],
    [3210, 2058], [3160, 2109], [3179, 2184], [3191, 2255],
    [3234, 2315], [3230, 2388], [3225, 2445], [3215, 2517]], // 2 - rivendell

    [[3215, 2517], [3167, 2512], [3120, 2502], [3078, 2488],
    [3033, 2468], [2987, 2453], [2915, 2429], [2788, 2413]], // 3 - moria

    [[2788, 2413], [2783, 2477], [2770, 2544], [2728, 2595],
    [2689, 2642], [2656, 2715]], // 4 - lorien

    [[2656, 2715], [2600, 2781], [2531, 2804], [2462, 2904],
    [2447, 2957], [2392, 2935], [2350, 2957], [2364, 3028],
    [2324, 3033], [2279, 2995], [2247, 3060], [2211, 3058],
    [2132, 3022], [2026, 3044], [1981, 3076]], // 5 - argonath

    [[1981, 3076], [2028, 3121], [2071, 3202], [2033, 3285],
    [1975, 3367]], // 6 - mordorEntrance

    [[1975, 3367], [1917, 3442], [1872, 3487], [1823, 3512],
    [1747, 3497], [1718, 3543], [1748, 3622]], // 7 - mordor
  ];

  // Avança para a próxima rota
  const nextRoute = () => {
    setRouteIndex((prev) => Math.min(prev + 1, paths.length - 1));
  };


  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {

    if (!map) return;
    const path = paths[routeIndex];
    if (!path || path.length < 2) return;

    const durations = Array(path.length - 1).fill(500);

    if (markerRef.current) map.removeLayer(markerRef.current);

    const marker = L.Marker.movingMarker(path, durations, { icon: characterIcon }).addTo(map);
    markerRef.current = marker;

    const interval = setInterval(() => {
      const latlng = marker.getLatLng();
      if (latlng) map.setView(latlng, map.getZoom(), { animate: false });
    }, 20);

    // Notifica pai que começou
    marker.on("start", () => {
      onMoving?.(true);
      map.setZoom(startZoom, { animate: true, duration: 0.5 });
    });

    marker.on("end", () => {
      onMoving?.(false);
      map.setZoom(endZoom, { animate: true, duration: 0.5 });

      if (routeIndex === paths.length - 1) {
        console.log("Última rota atingida:", true);
        onFinish?.(true);
      }
    });

    marker.start();

    return () => {
      clearInterval(interval);
      if (map.hasLayer(marker)) map.removeLayer(marker);
    };
  }, [map, routeIndex]);


  function handleClick() {
    nextRoute();
    setShowButton(false); // esconde depois do clique
  }
   const [showButton, setShowButton] = useState(false);

  // sua condição que define quando o botão aparece
  
   useEffect(()=>{
    if(ativo)setShowButton(true);
    onMoving?.(true)

  }, [ativo]) // exemplo: ativa o botão

  return (
    <div>{showButton && (
      <button className={`btn-next-map ${showButton ? "mostrar" : ""}`} onClick={handleClick} >
        Avançar
      </button>
    )}
    </div>
  );

}