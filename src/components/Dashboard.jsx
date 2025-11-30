import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Clock, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import RoomStyleSelector from './RoomStyleSelector';
import AIResultDisplay from './AIResultDisplay';
import AdPlaceholder from './AdPlaceholder';
import { getRemainingUploads, canUpload, incrementUsage, getDailyLimit } from '../utils/usageTracker';
import { analyzeRoom, isApiKeyConfigured } from '../services/cloudflareService';

// Modal component untuk limit reached
function LimitReachedModal({ isOpen, onClose, language }) {
    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
                <button style={modalStyles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>
                <div style={modalStyles.iconContainer}>
                    <Clock size={48} style={modalStyles.icon} />
                </div>
                <h2 style={modalStyles.title}>
                    {language === 'id' ? 'Limit Harian Tercapai' : 'Daily Limit Reached'}
                </h2>
                <p style={modalStyles.description}>
                    {language === 'id'
                        ? 'Anda telah menggunakan 3 kesempatan gratis hari ini. Silakan kembali besok untuk menggunakan fitur ini lagi!'
                        : 'You have used all 3 free attempts today. Please come back tomorrow to use this feature again!'}
                </p>
                <div style={modalStyles.timerBox}>
                    <p style={modalStyles.timerText}>
                        {language === 'id' ? 'Reset dalam:' : 'Resets in:'}
                    </p>
                    <p style={modalStyles.timerValue}>
                        {getTimeUntilReset()}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="btn btn-primary"
                    style={modalStyles.button}
                >
                    {language === 'id' ? 'Mengerti' : 'Got it'}
                </button>
            </div>
        </div>
    );
}

// Interstitial Ad Modal - muncul sebelum generate
function InterstitialAdModal({ isOpen, onClose, onContinue, language, countdown }) {
    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 style={modalStyles.title}>
                    {language === 'id' ? 'Iklan' : 'Advertisement'}
                </h2>

                {/* Ad Container */}
                <div style={adModalStyles.adContainer}>
                    {/*
                      Untuk Google AdSense Interstitial, ganti dengan:
                      <ins class="adsbygoogle"
                           style="display:block"
                           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                           data-ad-slot="XXXXXXXXXX"
                           data-ad-format="auto"></ins>
                    */}
                    <div style={adModalStyles.adPlaceholder}>
                        <p style={adModalStyles.adLabel}>Advertisement</p>
                        <div style={adModalStyles.adContent}>
                            <p style={adModalStyles.adText}>Interstitial Ad (300x250)</p>
                            <p style={adModalStyles.adSubtext}>Google AdSense akan tampil di sini</p>
                        </div>
                    </div>
                </div>

                <p style={adModalStyles.countdownText}>
                    {language === 'id'
                        ? `Lanjutkan dalam ${countdown} detik...`
                        : `Continue in ${countdown} seconds...`}
                </p>

                <button
                    onClick={onContinue}
                    disabled={countdown > 0}
                    className="btn btn-primary"
                    style={{
                        ...modalStyles.button,
                        opacity: countdown > 0 ? 0.5 : 1,
                        cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                    }}
                >
                    {countdown > 0
                        ? (language === 'id' ? `Tunggu ${countdown}s` : `Wait ${countdown}s`)
                        : (language === 'id' ? 'Lanjutkan Generate' : 'Continue Generate')}
                </button>
            </div>
        </div>
    );
}

const adModalStyles = {
    adContainer: {
        margin: 'var(--space-lg) 0',
    },
    adPlaceholder: {
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
    },
    adLabel: {
        fontSize: '10px',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: 'var(--space-sm)',
        textAlign: 'center',
    },
    adContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-border)',
    },
    adText: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-xs)',
    },
    adSubtext: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-muted)',
        opacity: 0.7,
    },
    countdownText: {
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-lg)',
        fontSize: 'var(--font-size-sm)',
    },
};

// Helper function to calculate time until midnight reset
function getTimeUntilReset() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = tomorrow - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-md)',
    },
    modal: {
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-2xl)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
    },
    closeButton: {
        position: 'absolute',
        top: 'var(--space-md)',
        right: 'var(--space-md)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-text-muted)',
        padding: 'var(--space-xs)',
    },
    iconContainer: {
        marginBottom: 'var(--space-lg)',
    },
    icon: {
        color: 'var(--color-warning)',
    },
    title: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-md)',
        color: 'var(--color-text)',
    },
    description: {
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-xl)',
        lineHeight: 1.6,
    },
    timerBox: {
        background: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)',
    },
    timerText: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-xs)',
    },
    timerValue: {
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        margin: 0,
    },
    button: {
        width: '100%',
    },
};

export default function Dashboard({ user, t, language }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState('modern');
    const [customContext, setCustomContext] = useState('');
    const [aiResult, setAiResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [remainingUploads, setRemainingUploads] = useState(3);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showAdModal, setShowAdModal] = useState(false);
    const [adCountdown, setAdCountdown] = useState(5);

    // Update remaining uploads on mount and when needed
    useEffect(() => {
        setRemainingUploads(getRemainingUploads());
    }, []);

    const handleImageSelect = (file) => {
        // Check limit before allowing image selection
        if (!canUpload()) {
            setShowLimitModal(true);
            return;
        }
        setSelectedImage(file);
        setAiResult(null);
        setError(null);
    };

    // Start ad countdown when ad modal opens
    useEffect(() => {
        let timer;
        if (showAdModal && adCountdown > 0) {
            timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [showAdModal, adCountdown]);

    const handleAnalyzeClick = () => {
        if (!selectedImage) {
            setError(t.pleaseUploadImage);
            return;
        }

        if (!selectedStyle) {
            setError(t.pleaseSelectStyle);
            return;
        }

        if (!isApiKeyConfigured()) {
            setError(language === 'id'
                ? 'API Gemini belum dikonfigurasi. Harap hubungi admin.'
                : 'Gemini API not configured. Please contact admin.');
            return;
        }

        // Check limits
        if (!canUpload()) {
            setShowLimitModal(true);
            return;
        }

        // Show interstitial ad first
        setAdCountdown(5);
        setShowAdModal(true);
    };

    const handleAdContinue = async () => {
        setShowAdModal(false);
        await performAnalysis();
    };

    const performAnalysis = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await analyzeRoom(selectedImage, selectedStyle, customContext);
            setAiResult(result);

            // Increment usage after successful analysis
            incrementUsage();
            setRemainingUploads(getRemainingUploads());
        } catch (err) {
            setError(err.message || (language === 'id'
                ? 'Gagal menganalisis ruangan. Silakan coba lagi.'
                : 'Failed to analyze room. Please try again.'));
            console.error('Analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    const canUserUpload = canUpload();

    return (
        <div className="container container-narrow" style={styles.dashboard}>
            <LimitReachedModal
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                language={language}
            />

            <InterstitialAdModal
                isOpen={showAdModal}
                onClose={() => setShowAdModal(false)}
                onContinue={handleAdContinue}
                language={language}
                countdown={adCountdown}
            />

            <div style={styles.header}>
                <h1 style={styles.title}>
                    {language === 'id' ? 'AI Room Designer' : 'AI Room Designer'}
                </h1>
                <p style={styles.subtitle}>
                    {language === 'id'
                        ? 'Upload foto ruangan dan dapatkan saran desain dari AI!'
                        : 'Upload your room photo and get AI-powered design suggestions!'}
                </p>
                <div style={styles.limitBadge}>
                    <Clock size={16} />
                    <span>
                        {language === 'id'
                            ? `${remainingUploads}/${getDailyLimit()} tersisa hari ini`
                            : `${remainingUploads}/${getDailyLimit()} remaining today`}
                    </span>
                </div>
            </div>

            {/* Ad Banner Top */}
            <AdPlaceholder isPremium={false} position="top" />

            <ImageUploader
                onImageSelect={handleImageSelect}
                isPremium={false}
                remainingUploads={remainingUploads}
                disabled={!canUserUpload}
                t={t}
            />

            <RoomStyleSelector
                selectedStyle={selectedStyle}
                onStyleSelect={setSelectedStyle}
                customContext={customContext}
                onContextChange={setCustomContext}
                t={t}
            />

            {error && (
                <div style={styles.errorBox}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div style={styles.analyzeSection}>
                <button
                    onClick={handleAnalyzeClick}
                    disabled={loading || !selectedImage || !canUserUpload}
                    className="btn btn-primary btn-lg"
                    style={styles.analyzeButton}
                >
                    {loading ? (
                        <>
                            <span className="loading"></span>
                            {t.analyzing}
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            {t.generateSuggestions}
                        </>
                    )}
                </button>
            </div>

            {/* Ad Banner Middle */}
            <AdPlaceholder isPremium={false} position="middle" />

            {aiResult && (
                <>
                    <AIResultDisplay
                        result={aiResult}
                        t={t}
                        language={language}
                    />
                    {/* Ad Banner After Result */}
                    <AdPlaceholder isPremium={false} position="bottom" />
                </>
            )}
        </div>
    );
}

const styles = {
    dashboard: {
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-4xl)',
    },
    header: {
        textAlign: 'center',
        marginBottom: 'var(--space-2xl)',
    },
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 800,
        marginBottom: 'var(--space-xs)',
        color: 'var(--color-text)',
    },
    subtitle: {
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--font-size-lg)',
        marginBottom: 'var(--space-md)',
    },
    limitBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        padding: 'var(--space-sm) var(--space-lg)',
        background: 'var(--color-bg-tertiary)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border)',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-lg)',
        background: 'var(--color-error)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-xl)',
        fontWeight: 500,
        boxShadow: 'var(--shadow-md)',
    },
    analyzeSection: {
        textAlign: 'center',
        marginTop: 'var(--space-2xl)',
        marginBottom: 'var(--space-2xl)',
    },
    analyzeButton: {
        minWidth: '300px',
        boxShadow: 'var(--shadow-glow)',
    },
};
