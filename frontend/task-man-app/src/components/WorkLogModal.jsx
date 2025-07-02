import React, { useState } from 'react';
import Modal from 'react-modal';
import './WorkLogModal.css';

// Důležité pro přístupnost - řekneme modálu, který element je hlavní obsah aplikace
Modal.setAppElement('#root');

const WorkLogModal = ({ isOpen, onRequestClose, taskName }) => {
    const [note, setNote] = useState('');

    const handleSave = () => {
        console.log(`Záznam pro úkol '${taskName}': ${note}`);
        alert('Záznam byl uložen (viz konzole).');
        onRequestClose(); // Zavřeme modální okno
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="worklog-modal"
            overlayClassName="worklog-overlay"
        >
            <h2>Záznam činnosti</h2>
            <p>Právě pracujete na úkolu: <strong>{taskName}</strong></p>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Co jste právě dokončili nebo na čem pracujete?"
                rows="5"
            />
            <div className="modal-buttons">
                <button onClick={onRequestClose} className="button-secondary">Zavřít</button>
                <button onClick={handleSave} className="button-primary">Uložit záznam</button>
            </div>
        </Modal>
    );
};

export default WorkLogModal;