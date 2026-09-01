import "./styles/ModalOverlay.css";

export interface ModalOverlayProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ModalOverlay({ children, isOpen, onClose, title }: ModalOverlayProps) {
  return (
    <div className={`modal ${isOpen ? "open" : "closed"}`}>
      <div className="overlay" onClick={onClose} />
      <div className="content">
        {title && <h2>{title}</h2>}
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
