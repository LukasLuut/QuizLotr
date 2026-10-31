import "./LoadingScreen.css";

function LoadingScreen({ message = "Carregando..." }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-ring" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingScreen;
