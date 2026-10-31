import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal acessível: role="dialog", foco preso dentro, Esc fecha
 * e o foco volta para o elemento que abriu o modal.
 */
function Modal({ isOpen, onClose, labelledBy, className = "", overlayClassName = "modal-overlay", closeOnOverlay = true, children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const node = dialogRef.current;
    const previous = document.activeElement;
    const focusables = () => [...node.querySelectorAll(FOCUSABLE)];
    (focusables()[0] || node).focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
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
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      if (previous && typeof previous.focus === "function") previous.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={overlayClassName}
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
