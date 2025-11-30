import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import { translations } from './i18n/translations';
import './index.css';

function App() {
  const [language, setLanguage] = useState('id'); // Default to Indonesian

  // Get translations for current language
  const t = translations[language];

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('ai_room_designer_language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('ai_room_designer_language', newLanguage);
  };


  const scrollToDesign = () => {
    const designSection = document.getElementById('design-section');
    if (designSection) {
      designSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        t={t}
      />

      <Hero onGetStarted={scrollToDesign} t={t} />

      {/* Design Section - Langsung bisa digunakan tanpa login */}
      <section id="design-section">
        <Dashboard user={null} t={t} language={language} />
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <p style={styles.footerText}>
            {t.footerText}
          </p>
          <p style={styles.footerSubtext}>
            {t.footerSubtext}
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  footer: {
    padding: 'var(--space-3xl) 0',
    background: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border)',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-sm)',
  },
  footerSubtext: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
};

export default App;
