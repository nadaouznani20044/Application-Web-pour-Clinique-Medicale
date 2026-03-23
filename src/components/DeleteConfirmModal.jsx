import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import '../styles/DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, itemName, itemType = 'Service', onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-alert" onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon">
          <AlertTriangle size={48} />
        </div>

        <div className="alert-content">
          <h2 className="alert-title">⚠️ Confirmation de suppression</h2>
          
          <p className="alert-message">
            Êtes-vous sûr de vouloir supprimer <strong>{itemType}</strong> <span className="highlight">{itemName}</span> ?
          </p>

          <p className="alert-warning">
            ⚠️ Cette action est <strong>irréversible</strong> et affectera toutes les données rattachées.
          </p>
        </div>

        <div className="form-actions alert-actions">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-cancel"
          >
            Annuler
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="btn-delete-confirm"
          >
            🗑️ Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
