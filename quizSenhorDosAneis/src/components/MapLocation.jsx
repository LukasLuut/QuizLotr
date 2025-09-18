import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapImage from "../assets/images/map.webp";
import L from "leaflet";
import { useState } from "react";

// Ícones de exemplo (bonequinho)
const characterIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448615.png",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

export default function MapLocation() {
  const bounds = [
    [0, 0],
    [4344, 5000],
  ];

  const [path, setPath] = useState([]); // array de coordenadas

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      maxBounds={bounds}
      maxBoundsViscosity={1}
      style={{ height: "100%", width: "100%" }}
      minZoom={-2.5}
      center={[3185, 1595]}
      zoom={0.2}
    >
      <ImageOverlay url={mapImage} bounds={bounds} />

      {/* Mostra os pontos clicados */}
      {path.map((pos, idx) => (
        <Marker key={idx} position={pos} icon={characterIcon}>
          <Popup>Ponto {idx + 1}</Popup>
        </Marker>
      ))}

      {/* Captura cliques */}
      <ClickLogger path={path} setPath={setPath} />
    </MapContainer>
  );
}

function ClickLogger({ path, setPath }) {
  useMapEvents({
    click(e) {
      const newPoint = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)]; // arredonda para facilitar
      const newPath = [...path, newPoint];
      setPath(newPath);

      // Mostra no console no formato que você quer
      console.clear(); // opcional, limpa console para ver só os últimos cliques
      console.log("path =", JSON.stringify(newPath, null, 4), ";");
    },
  });

  return null;
}
