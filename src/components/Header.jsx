import React from 'react';
import { Sparkles, Globe } from 'lucide-react';

export default function Header({ language, onLanguageChange, t }) {
    return (
        <header style={styles.header}>
            <div className="container" style={styles.container}>
                <div style={styles.logo}>
                    <Sparkles size={32} style={styles.logoIcon} />
                    <span style={styles.logoText}>AI Room Designer</span>
                </div>

                <nav style={styles.nav}>
                    {/* Language Switcher */}
                    <div style={styles.languageSwitcher}>
                        <Globe size={18} style={styles.globeIcon} />
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            style={styles.languageSelect}
                        >
                            <option value="id">🇮🇩 ID</option>
                            <option value="en">🇬🇧 EN</option>
                        </select>
                    </div>

                </nav>
            </div>
        </header>
    );
}

const styles = {
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--glass-border)',
        padding: 'var(--space-lg) 0',
        boxShadow: 'var(--shadow-md)',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
    },
    logoIcon: {
        color: 'var(--color-primary)',
        filter: 'drop-shadow(0 0 10px rgba(160, 100, 255, 0.5))',
    },
    logoText: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 800,
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        flexWrap: 'wrap',
    },
    languageSwitcher: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
    },
    globeIcon: {
        color: 'var(--color-primary)',
    },
    languageSelect: {
        border: 'none',
        background: 'transparent',
        color: 'var(--color-text)',
        fontWeight: 600,
        fontSize: 'var(--font-size-sm)',
        cursor: 'pointer',
        outline: 'none',
    },
};
