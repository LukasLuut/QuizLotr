import {  MapContainer, ImageOverlay, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapImage from "../assets/images/map.webp";
import L from "leaflet";
import { useEffect } from "react";

// 🔹 Importe o plugin MovingMarker manualmente
import "../public/plugins/leaflet-moving-maker/MovingMarker"; // coloque o arquivo MovingMarker.js em public/plugins/

// Ícones customizados
import mordorIconUrl from "../assets/icons/mordor.png";
import shireIconUrl from "../assets/icons/Map Icons/House.png";
import rivendellIconUrl from "../assets/icons/rivendell.png";

// Ícone provisório do bonequinho
const characterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448615.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

export default function MapaTerraMedia(props) {
  const bounds = [
    [0, 0],
    [4344, 5000],
  ];

  // Coordenadas do caminho do bonequinho (pixels na imagem)
 const paths = {
  bri: [
    [3183, 1484],
    [3133, 1497],
    [3110, 1544],
    [3126, 1614],
    [3169, 1674],
    [3158, 1752],
    [3182, 1797],
  ],
  rivendel: [
    [3182, 1797],
    [3218, 1832],
    [3196, 1906],
    [3217, 1977],
    [3210, 2058],
    [3160, 2109],
    [3179, 2184],
    [3191, 2255],
    [3234, 2315],
    [3230, 2388],
    [3225, 2445],
    [3215, 2517],
  ],
  moria: [
    [3215, 2517],
    [3167, 2512],
    [3120, 2502],
    [3078, 2488],
    [3033, 2468],
    [2987, 2453],
    [2915, 2429],
    [2788, 2413],
  ],
  lorien: [
    [2788, 2413],
    [2783, 2477],
    [2770, 2544],
    [2728, 2595],
    [2689, 2642],
    [2656, 2715],
  ],
  argonath: [
    [2656, 2715],
    [2600, 2781],
    [2531, 2804],
    [2462, 2904],
    [2447, 2957],
    [2392, 2935],
    [2350, 2957],
    [2364, 3028],
    [2324, 3033],
    [2279, 2995],
    [2247, 3060],
    [2211, 3058],
    [2132, 3022],
    [2026, 3044],
    [1981, 3076],
  ],
  mordorEntrance: [
    [1981, 3076],
    [2028, 3121],
    [2071, 3202],
    [2033, 3285],
    [1975, 3367],
  ],
  mordor: [
    [1975, 3367],
    [1917, 3442],
    [1872, 3487],
    [1823, 3512],
    [1747, 3497],
    [1718, 3543],
    [1748, 3622],
  ],
};

  const caminho = paths[props.path];
  console.log(caminho)

  const path2 = [
    [3285, 1755], // Shire
    [3282, 3790], // Bri
    [2000, 3500], // Mordor
  ];

  // Ícones dos marcadores
  const mordorIcon = new L.Icon({
    iconUrl: mordorIconUrl,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -40],
  });

  const shireIcon = new L.Icon({
    iconUrl: shireIconUrl,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -40],
  });

  const rivendellIcon = new L.Icon({
    iconUrl: rivendellIconUrl,
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
      zoom={0.2}
      zoomControl={false}
      attributionControl={false}
    >
      <ImageOverlay url={mapImage} bounds={bounds} zIndex={1} />

     
      {/* Bonequinho animado */}
      <MovingCharacter path={caminho} />

      {/* Marcadores temáticos */}
      <Marker position={[3185, 1485]} icon={shireIcon}>
        <Popup>Hobbington: “Lar dos Hobbits...”</Popup>
      </Marker>

      <Marker position={[3182, 1790]} icon={rivendellIcon}>
        <Popup>Bri: “Lar dos vagabundos e prostitutas...”</Popup>
      </Marker>

      <Marker position={[2000, 3500]} icon={mordorIcon}>
        <Popup>Mordor: “Terra de Sauron...”</Popup>
      </Marker>

            
    </MapContainer>
  );
}

export function MovingCharacter({ path, startZoom = 0.1, endZoom = 0.2, normalZoom = 0.2 }) {
  console.log("LUUT É GAY")
  const map = useMap();


  useEffect(() => {
    if (!map || path.length < 2) return;

    const durations = Array(path.length - 1).fill(1000);
    const marker = L.Marker.movingMarker(path, durations, { icon: characterIcon }).addTo(map);

    // Zoom in no início
    marker.on("start", () => {
      map.setZoom(startZoom, { animate: true, duration: 0.5 });
    });

    // Zoom out no final
    marker.on("end", () => {
      map.setZoom(endZoom, { animate: true, duration: 0.5 });
    });

    // Atualiza a câmera a cada 50ms
    const interval = setInterval(() => {
      const latlng = marker.getLatLng();
      if (latlng) {
        map.setView(latlng, map.getZoom(), { animate: false });
      }
    }, 20);

    marker.start();

    return () => {
      clearInterval(interval);
      map.removeLayer(marker);
    };
  }, [map, path, startZoom, endZoom]);

  return null;
}






