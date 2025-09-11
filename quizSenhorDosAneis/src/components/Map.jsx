import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapImage from "../assets/images/map.webp";
import L from "leaflet";

// Ícones customizados
import mordorIconUrl from "../assets/icons/mordor.png";
import shireIconUrl from "../assets/icons/shire.png";
import rivendellIconUrl from "../assets/icons/rivendell.png";

export default function MapaTerraMedia() {
  // Tamanho da imagem em pixels 
  const bounds = [
    [0, 0], // canto inferior esquerdo
    [4344, 5000], // altura x largura 
  ];

  // Criando ícones customizados
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
        maxBounds={bounds}        // não deixa arrastar além da borda da imagem
        maxBoundsViscosity={0}  // "cola" a borda (0 = livre, 1 = totalmente restrito)
        style={{ height: "100%", width: "100%" }}
        minZoom={-2.5}
    >
      <ImageOverlay url={mapImage} bounds={bounds} />

      {/* Marcadores temáticos */}
      <Marker position={[3600, 4200]} icon={mordorIcon}>
        <Popup>Mordor: “Um Anel para a todos governar...”</Popup>
      </Marker>

      <Marker position={[300, 300]} icon={shireIcon}>
        <Popup>Condado: Lar dos Hobbits!</Popup>
      </Marker>

      <Marker position={[500, 1200]} icon={rivendellIcon}>
        <Popup>Rivendell: O refúgio dos Elfos</Popup>
      </Marker>
    </MapContainer>
  );
}
