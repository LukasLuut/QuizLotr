import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import mapImage from "../assets/images/map.webp";
import movingMarker from "../lib/leaflet/MovingMarker";
import frodoIconUrl from "../assets/icons/frodo-icon.png";
import Button from "./buttons/Button";
import "./Map.css";

const BOUNDS = [
  [0, 0],
  [4344, 5000],
];

// Ícones criados uma vez (fora do componente): o personagem é o Frodo (assets/icons/frodo-icon.png)
const characterIcon = new L.Icon({
  iconUrl: frodoIconUrl,
  className: "character-marker",
  iconSize: [48, 48],
  iconAnchor: [24, 44],
});

// Rotas entre as regiões. paths[r] termina na região r (0 = Condado ... 7 = Montanha da Perdição).
const PATHS = [
  [[3185, 1485]], // 0 - Condado
  [[3185, 1485], [3133, 1497], [3110, 1544], [3126, 1614], [3169, 1674], [3158, 1752], [3182, 1797]], // 1 - Bri
  [[3182, 1797], [3218, 1832], [3196, 1906], [3217, 1977], [3210, 2058], [3160, 2109], [3179, 2184], [3191, 2255], [3234, 2315], [3230, 2388], [3225, 2445], [3215, 2517]], // 2 - Valfenda
  [[3215, 2517], [3167, 2512], [3120, 2502], [3078, 2488], [3033, 2468], [2987, 2453], [2915, 2429], [2788, 2413]], // 3 - Moria
  [[2788, 2413], [2783, 2477], [2770, 2544], [2728, 2595], [2689, 2642], [2656, 2715]], // 4 - Lothlórien
  [[2656, 2715], [2600, 2781], [2531, 2804], [2462, 2904], [2447, 2957], [2392, 2935], [2350, 2957], [2364, 3028], [2324, 3033], [2279, 2995], [2247, 3060], [2211, 3058], [2132, 3022], [2026, 3044], [1981, 3076]], // 5 - Argonath
  [[1981, 3076], [2028, 3121], [2071, 3202], [2033, 3285], [1975, 3367]], // 6 - Mordor
  [[1975, 3367], [1917, 3442], [1872, 3487], [1823, 3512], [1747, 3497], [1718, 3543], [1748, 3622]], // 7 - Montanha da Perdição
];

const endOf = (region) => {
  const path = PATHS[Math.min(Math.max(region, 0), PATHS.length - 1)];
  return path[path.length - 1];
};

const TRAVEL_ZOOM = 0.2;
const REST_ZOOM = -1;
// Velocidade constante do personagem (unidades do mapa por ms) e limites da viagem
const WALK_SPEED = 0.15;
const MIN_TRAVEL_MS = 3800;
const MAX_TRAVEL_MS = 7000;
// Quanto a câmera se aproxima do personagem a cada quadro (0..1)
const FOLLOW_EASE = 0.1;

// Duração de cada trecho proporcional ao comprimento: o Frodo anda sempre na mesma
// velocidade, em vez de acelerar nos trechos longos e quase parar nos curtos
function segmentDurations(path) {
  const lengths = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  const travelMs = Math.min(MAX_TRAVEL_MS, Math.max(MIN_TRAVEL_MS, total / WALK_SPEED));
  return lengths.map((len) => Math.max(16, Math.round((len / total) * travelMs)));
}

export default function MapaTerraMedia({ region = 0, targetRegion = null, travelling = false, showAdvance = false, intro = false, onAdvance, onArrive }) {
  return (
    <div className="map-wrapper">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={BOUNDS}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1} // impede arrastar além da borda
        style={{ height: "100%", width: "100%" }}
        minZoom={-2.5}
        zoomSnap={0.1}
        center={endOf(region)}
        zoom={REST_ZOOM}
        zoomControl={false}
        attributionControl={false}
        keyboard={false}
      >
        <ImageOverlay url={mapImage} bounds={BOUNDS} zIndex={1} />
        <KeepCenterOnResize />
        {intro && <IntroZoom target={endOf(0)} />}
        <MovingCharacter region={region} targetRegion={targetRegion} travelling={travelling} intro={intro} onArrive={onArrive} />

      </MapContainer>

      {showAdvance && (
        <Button className="btn-next-map" onClick={onAdvance}>
          Avançar
        </Button>
      )}
    </div>
  );
}

// O quadro do mapa muda de altura entre as fases; o Leaflet só percebe mudanças de
// tamanho da janela. Aqui ele recalcula o tamanho mantendo o mesmo centro.
// Enquanto o mapa se move (abertura, viagem), só recalcula o tamanho: um setView
// nesse momento cancelaria a animação em andamento.
function KeepCenterOnResize() {
  const map = useMap();

  useEffect(() => {
    let moving = false;
    const onStart = () => (moving = true);
    const onEnd = () => (moving = false);
    map.on("movestart zoomstart", onStart);
    map.on("moveend zoomend", onEnd);

    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      if (moving) {
        map.invalidateSize({ animate: false, pan: false });
        return;
      }
      const center = map.getCenter();
      map.invalidateSize({ animate: false, pan: false });
      map.setView(center, map.getZoom(), { animate: false });
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      map.off("movestart zoomstart", onStart);
      map.off("moveend zoomend", onEnd);
    };
  }, [map]);

  return null;
}

// Abertura: começa com o mapa inteiro e aproxima até o Condado
export function IntroZoom({ target }) {
  const map = useMap();

  useEffect(() => {
    map.setView([2200, 2500], -2.5, { animate: false });
    const t = setTimeout(() => map.flyTo(target, REST_ZOOM, { duration: 7, easeLinearity: 0.25 }), 500);
    return () => clearTimeout(t);
  }, [map, target]);

  return null;
}

// Personagem: parado no fim da região atual; anda pela rota quando travelling vira true
export function MovingCharacter({ region, targetRegion, travelling, intro, onArrive }) {
  const map = useMap();
  const markerRef = useRef(null);
  const centered = useRef(false);
  const onArriveRef = useRef(onArrive);
  onArriveRef.current = onArrive;

  // Marcador parado na região atual (ao montar e ao retomar uma partida)
  useEffect(() => {
    if (travelling) return;
    const pos = endOf(region);
    if (markerRef.current) map.removeLayer(markerRef.current);
    markerRef.current = L.marker(pos, { icon: characterIcon, keyboard: false, interactive: false }).addTo(map);
    // Centraliza no personagem só ao abrir a tela (na partida nova, a animação de abertura
    // já faz isso; na chegada de uma viagem, o zoom de saída suave cuida do enquadramento)
    if (!intro && !centered.current) map.setView(pos, REST_ZOOM, { animate: false });
    centered.current = true;
  }, [map, region, travelling]); // eslint-disable-line react-hooks/exhaustive-deps

  // Viagem até a próxima região
  useEffect(() => {
    if (!travelling || targetRegion === null) return;
    const path = PATHS[targetRegion];
    if (!path || path.length < 2) {
      onArriveRef.current?.();
      return;
    }

    let marker = null;
    let frame = null;
    let cancelled = false;

    // A câmera segue o personagem com amortecimento (aproxima um pouco a cada quadro),
    // sem os saltos de um panTo a intervalos fixos
    const follow = () => {
      if (!marker) return;
      const target = marker.getLatLng();
      const center = map.getCenter();
      const next = L.latLng(center.lat + (target.lat - center.lat) * FOLLOW_EASE, center.lng + (target.lng - center.lng) * FOLLOW_EASE);
      map.setView(next, map.getZoom(), { animate: false });
      frame = requestAnimationFrame(follow);
    };

    let started = false;
    const startWalking = () => {
      if (cancelled || started) return;
      started = true;
      if (markerRef.current) map.removeLayer(markerRef.current);
      marker = movingMarker(path, segmentDurations(path), { icon: characterIcon, interactive: false }).addTo(map);
      markerRef.current = marker;
      marker.on("end", () => {
        cancelAnimationFrame(frame);
        // chegada: afasta o zoom devagar, centralizado no destino
        map.flyTo(marker.getLatLng(), REST_ZOOM, { duration: 1.4, easeLinearity: 0.3 });
        onArriveRef.current?.();
      });
      marker.start();
      frame = requestAnimationFrame(follow);
    };

    // partida: aproxima a câmera no personagem antes de ele começar a andar
    map.once("moveend", startWalking);
    map.flyTo(path[0], TRAVEL_ZOOM, { duration: 1, easeLinearity: 0.3 });
    // se a câmera já estava no lugar (sem moveend), começa assim mesmo
    const fallback = setTimeout(startWalking, 1300);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      cancelAnimationFrame(frame);
      map.off("moveend", startWalking);
      marker?.off();
    };
  }, [map, travelling, targetRegion]);

  // Remove o marcador ao desmontar o mapa
  useEffect(
    () => () => {
      if (markerRef.current) map.removeLayer(markerRef.current);
    },
    [map]
  );

  return null;
}
