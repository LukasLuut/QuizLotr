export function MovingCharacter({ path, startZoom = 0.2, endZoom = -1 }) {
  const map = useMap();
  const markerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!map || !path || path.length < 2) return;

    // Se o marcador já existe, só atualiza a rota
    if (markerRef.current) {
      markerRef.current.moveTo(path, Array(path.length - 1).fill(1000));
      return;
    }

    // Cria o marcador na primeira vez
    const durations = Array(path.length - 1).fill(1000);
    const marker = L.Marker.movingMarker(path, durations, { icon: characterIcon }).addTo(map);

    markerRef.current = marker;

    marker.on("start", () => {
      map.setZoom(startZoom, { animate: true, duration: 0.5 });
    });

    marker.on("end", () => {
      map.setZoom(endZoom, { animate: true, duration: 0.5 });
    });

    // Atualiza a câmera
    intervalRef.current = setInterval(() => {
      const latlng = marker.getLatLng();
      if (latlng) {
        map.setView(latlng, map.getZoom(), { animate: false });
      }
    }, 20);

    marker.start();

    return () => {
      clearInterval(intervalRef.current);
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    };
  }, [map]);

  // Quando `path` muda, manda o marcador andar
  useEffect(() => {
    if (markerRef.current && path && path.length > 1) {
      markerRef.current.moveTo(path, Array(path.length - 1).fill(1000));
      markerRef.current.start();
    }
  }, [path]);

  return null;
}
