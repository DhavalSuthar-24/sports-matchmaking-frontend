// Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('portal-root')! // 👈 where it's rendered
  );
};

export default Modal;
