export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <header>
          <h2>{title}</h2>
          <button className="iconButton" onClick={onClose}>x</button>
        </header>
        {children}
      </div>
    </div>
  );
}
