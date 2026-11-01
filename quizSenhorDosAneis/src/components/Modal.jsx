import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

// Pilha de modais abertos: o Esc fecha só o de cima, mesmo com o foco fora dele
const openModals = [];

// duração da saída (igual a modal-out em Modal.css): o modal fica montado até ela acabar
const EXIT_MS = 180;

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal acessível: role="dialog", foco preso dentro, Esc fecha
 * e o foco volta para o elemento que abriu o modal.
 * Surge (fundo esmaece, caixa cresce de leve) e, ao fechar, some antes de desmontar.
 */
function Modal({ isOpen, onClose, labelledBy, className = "", overlayClassName = "modal-overlay", closeOnOverlay = true, closeOnEscape = true, children }) {
  const closeOnEscapeRef = useRef(closeOnEscape);
  closeOnEscapeRef.current = closeOnEscape;
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [rendered, setRendered] = useState(isOpen);
  if (isOpen && !rendered) setRendered(true);

  // fechou: espera a animação de saída e desmonta
  useEffect(() => {
    if (isOpen || !rendered) return;
    const timer = setTimeout(() => setRendered(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [isOpen, rendered]);

  useEffect(() => {
    if (!isOpen) return;
    const node = dialogRef.current;
    const previous = document.activeElement;
    const token = {};
    openModals.push(token);
    const focusables = () => [...node.querySelectorAll(FOCUSABLE)];
    (focusables()[0] || node).focus();

    const onEscape = (e) => {
      if (e.key !== "Escape" || !closeOnEscapeRef.current || openModals[openModals.length - 1] !== token) return;
      e.stopPropagation();
      e.preventDefault();
      onCloseRef.current?.();
    };

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    // captura: roda antes do atalho Esc da tela do jogo
    document.addEventListener("keydown", onEscape, true);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keydown", onEscape, true);
      openModals.splice(openModals.indexOf(token), 1);
      if (previous && typeof previous.focus === "function") previous.focus();
    };
  }, [isOpen]);

  if (!rendered) return null;
  const phase = isOpen ? "modal-in" : "modal-out";

  return createPortal(
    <div
      className={`${overlayClassName} ${phase}`}
      // saindo: fora da árvore acessível e sem receber cliques
      aria-hidden={!isOpen || undefined}
      inert={!isOpen || undefined}
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onCloseRef.current?.();
      }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} className={className}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
