import React from 'react';
import { Sparkles, Download, Share2 } from 'lucide-react';

export default function AIResultDisplay({ result, t, language }) {
    if (!result) return null;

    const handleDownload = () => {
        const blob = new Blob([result.suggestions], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `room-design-${result.style}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AI Room Design Suggestions',
                    text: result.suggestions.substring(0, 200) + '...',
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            navigator.clipboard.writeText(result.suggestions);
            alert(language === 'id' ? 'Saran desain telah disalin ke clipboard!' : 'Design suggestions copied to clipboard!');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    <Sparkles size={24} />
                    {t.aiSuggestionsFor} {result.style}
                </h3>
                <div style={styles.actions}>
                    <button onClick={handleShare} className="btn btn-secondary btn-sm">
                        <Share2 size={16} />
                        {t.share}
                    </button>
                    <button onClick={handleDownload} className="btn btn-primary btn-sm">
                        <Download size={16} />
                        {t.download}
                    </button>
                </div>
            </div>

            <div style={styles.resultCard}>
                <div style={styles.content}>
                    <pre style={styles.suggestions}>{result.suggestions}</pre>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginTop: 'var(--space-2xl)',
        animation: 'fadeIn 0.6s ease-out',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-lg)',
        flexWrap: 'wrap',
        gap: 'var(--space-md)',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        fontSize: 'var(--font-size-xl)',
        fontWeight: 700,
        margin: 0,
        textTransform: 'capitalize',
    },
    actions: {
        display: 'flex',
        gap: 'var(--space-sm)',
    },
    resultCard: {
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-md)',
    },
    content: {},
    suggestions: {
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--font-size-base)',
        lineHeight: 1.8,
        color: 'var(--color-text)',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        margin: 0,
    },
};
