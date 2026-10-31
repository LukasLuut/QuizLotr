import { Link } from "react-router-dom";
import "../components/LoadingScreen.css";

function NotFound() {
  return (
    <main className="loading-screen">
      <p>Nem todos os que vagueiam estão perdidos... mas esta página está.</p>
      <Link className="btn" to="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
        Voltar ao início
      </Link>
    </main>
  );
}

export default NotFound;
