import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import './ContactPage.css';

const ContactPage = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    
    // ... (funkce handleFormChange a handleFormSubmit beze změny)
    const handleFormChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };
    const handleFormSubmit = (e) => { e.preventDefault(); console.log("Odesílání formuláře:", form); alert("Zpráva odeslána (viz konzole). Děkujeme!"); setForm({ name: '', email: '', message: '' }); };

    return (
        <div className="contact-page-layout">
            <div className="contact-card form-card">
                <h2>{t('contactUsTitle')}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">{t('yourName')}</label>
                        <input type="text" id="name" name="name" value={form.name} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">{t('yourEmail')}</label>
                        <input type="email" id="email" name="email" value={form.email} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">{t('message')}</label>
                        <textarea id="message" name="message" rows="5" value={form.message} onChange={handleFormChange} required></textarea>
                    </div>
                    <button type="submit" className="form-button">{t('sendMessage')}</button>
                </form>
            </div>
            <div className="contact-card direct-card">
                <h2>{t('footerContact')}</h2>
                <p>{t('contactUsSubtitle')}</p>
                <div className="direct-contact-options">
                    {/* ... (tlačítka pro přímý kontakt beze změny) ... */}
                </div>
            </div>
        </div>
    );
};
export default ContactPage;