import { MapContainer, ImageOverlay, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import mapImage from "../assets/images/map.webp";
import movingMarker from "../lib/leaflet/MovingMarker";
import shireIconUrl from "../assets/icons/Map Icons/House.png";
import Button from "./buttons/Button";
import "./Map.css";

const BOUNDS = [
  [0, 0],
  [4344, 5000],
];

// Ícones criados uma vez (fora do componente): o personagem é um anel desenhado em SVG, sem depender de CDN
const characterIcon = L.divIcon({
  className: "character-marker",
  html: '<span class="character-ring" aria-hidden="true"></span>',
  iconSize: [36, 36],
  iconAnchor: [18, 30],
});

const shireIcon = new L.Icon({
  iconUrl: shireIconUrl,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -40],
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

const SEGMENT_MS = 500;
const TRAVEL_ZOOM = 0.2;
const REST_ZOOM = -1;

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
        {intro && <IntroZoom target={endOf(0)} />}
        <MovingCharacter region={region} targetRegion={targetRegion} travelling={travelling} onArrive={onArrive} />

        <Marker position={[3210, 1520]} icon={shireIcon}>
          <Popup>Hobbington: “Lar dos Hobbits...”</Popup>
        </Marker>
      </MapContainer>

      {showAdvance && (
        <Button className="btn-next-map" onClick={onAdvance}>
          Avançar
        </Button>
      )}
    </div>
  );
}

// Abertura: começa com o mapa inteiro e aproxima até o Condado
export function IntroZoom({ target }) {
  const map = useMap();

  useEffect(() => {
    map.setView([2200, 2500], -2.5, { animate: false });
    const t = setTimeout(() => map.flyTo(target, REST_ZOOM, { duration: 6, easeLinearity: 0.25 }), 500);
    return () => clearTimeout(t);
  }, [map, target]);

  return null;
}

// Personagem: parado no fim da região atual; anda pela rota quando travelling vira true
export function MovingCharacter({ region, targetRegion, travelling, onArrive }) {
  const map = useMap();
  const markerRef = useRef(null);
  const onArriveRef = useRef(onArrive);
  onArriveRef.current = onArrive;

  // Marcador parado na região atual (ao montar e ao retomar uma partida)
  useEffect(() => {
    if (travelling) return;
    const pos = endOf(region);
    if (markerRef.current) map.removeLayer(markerRef.current);
    markerRef.current = L.marker(pos, { icon: characterIcon, keyboard: false, interactive: false }).addTo(map);
  }, [map, region, travelling]);

  // Viagem até a próxima região
  useEffect(() => {
    if (!travelling || targetRegion === null) return;
    const path = PATHS[targetRegion];
    if (!path || path.length < 2) {
      onArriveRef.current?.();
      return;
    }

    if (markerRef.current) map.removeLayer(markerRef.current);
    const marker = movingMarker(path, Array(path.length - 1).fill(SEGMENT_MS), { icon: characterIcon, interactive: false }).addTo(map);
    markerRef.current = marker;

    // A câmera segue o personagem só enquanto ele anda
    let follow = null;
    const stopFollow = () => {
      if (follow) clearInterval(follow);
      follow = null;
    };

    marker.on("start", () => {
      map.setZoom(TRAVEL_ZOOM, { animate: true });
      follow = setInterval(() => map.panTo(marker.getLatLng(), { animate: false }), 40);
    });
    marker.on("end", () => {
      stopFollow();
      map.setView(marker.getLatLng(), REST_ZOOM, { animate: true });
      onArriveRef.current?.();
    });
    marker.start();

    return () => {
      stopFollow();
      marker.off();
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
