import { Component } from "react";
import "./LoadingScreen.css";

// Evita a tela branca: qualquer erro de renderização mostra uma saída para o jogador
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Erro na interface:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="loading-screen" role="alert">
        <p>Uma sombra caiu sobre a Terra-média.</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 16 }}>Algo deu errado ao mostrar esta tela.</p>
        <button type="button" className="btn" onClick={() => window.location.assign("/")}>
          <span>Voltar ao início</span>
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
