import React from 'react';
import { Sparkles, Zap, Crown } from 'lucide-react';

export default function Hero({ onGetStarted, t }) {
    return (
        <section style={styles.hero}>
            <div style={styles.gradientBg}></div>
            <div className="container" style={styles.container}>
                <div style={styles.content}>
                    <h1 className="gradient-text-hero" style={styles.title}>
                        {t.heroTitle}
                    </h1>
                    <p style={styles.subtitle}>
                        {t.heroSubtitle}
                    </p>

                    <div style={styles.features}>
                        <div style={styles.feature}>
                            <div style={styles.featureIconWrapper}>
                                <Sparkles size={24} style={styles.featureIcon} />
                            </div>
                            <span>{t.aiPoweredDesign}</span>
                        </div>
                        <div style={styles.feature}>
                            <div style={styles.featureIconWrapper}>
                                <Zap size={24} style={styles.featureIcon} />
                            </div>
                            <span>{t.instantResults}</span>
                        </div>
                        <div style={styles.feature}>
                            <div style={styles.featureIconWrapper}>
                                <Crown size={24} style={styles.featureIcon} />
                            </div>
                            <span>{t.roomStyles}</span>
                        </div>
                    </div>

                    <button onClick={onGetStarted} className="btn btn-primary btn-lg" style={styles.cta}>
                        <Sparkles size={20} />
                        {t.getStartedFree}
                    </button>

                    <p style={styles.note}>
                        {t.freeUploadsNoteSimple}
                    </p>
                </div>
            </div>
        </section>
    );
}

const styles = {
    hero: {
        position: 'relative',
        padding: 'var(--space-4xl) 0',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%)',
    },
    gradientBg: {
        position: 'absolute',
        top: '-50%',
        left: '-25%',
        width: '150%',
        height: '200%',
        background: 'var(--gradient-hero)',
        opacity: 0.15,
        filter: 'blur(100px)',
        animation: 'gradientShift 10s ease infinite',
        pointerEvents: 'none',
    },
    container: {
        position: 'relative',
        zIndex: 1,
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
    },
    title: {
        fontSize: 'var(--font-size-5xl)',
        fontWeight: 800,
        marginBottom: 'var(--space-lg)',
        lineHeight: 1.1,
    },
    subtitle: {
        fontSize: 'var(--font-size-xl)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-2xl)',
        lineHeight: 1.6,
    },
    features: {
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-xl)',
        marginBottom: 'var(--space-2xl)',
        flexWrap: 'wrap',
    },
    feature: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        color: 'var(--color-text)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 600,
    },
    featureIconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-glow)',
    },
    featureIcon: {
        color: 'white',
    },
    cta: {
        marginBottom: 'var(--space-lg)',
        boxShadow: 'var(--shadow-glow)',
    },
    note: {
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
    },
};
