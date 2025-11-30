import React from 'react';
import { Sparkles, Download, Share2, Image } from 'lucide-react';

// Simple markdown to HTML converter
function renderMarkdown(text) {
    if (!text) return '';

    // Remove [Image #X] placeholders from AI response
    let cleanText = text.replace(/\[Image #\d+\]/g, '');

    let html = cleanText
        // Escape HTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Bold **text**
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // Italic *text*
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Headers
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
        // Bullet points with proper list handling
        .replace(/^\* (.+)$/gm, '<li>$1</li>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Numbered lists
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>');

    // Wrap consecutive <li> items in <ul>
    html = html.replace(/(<li>.*?<\/li>)(\s*<br\/>)*(<li>)/g, '$1$3');
    html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    return `<p>${html}</p>`;
}

export default function AIResultDisplay({ result, t, language }) {
    if (!result) return null;

    const handleDownloadText = () => {
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

    const handleDownloadImage = () => {
        if (!result.generatedImage) return;

        const link = document.createElement('a');
        link.href = `data:${result.generatedImage.mimeType};base64,${result.generatedImage.data}`;
        link.download = `room-design-${result.style}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    <button onClick={handleDownloadText} className="btn btn-primary btn-sm">
                        <Download size={16} />
                        {t.download}
                    </button>
                </div>
            </div>

            {/* Generated Image */}
            {result.generatedImage && (
                <div style={styles.imageSection}>
                    <div style={styles.imageTitleRow}>
                        <h4 style={styles.imageTitle}>
                            <Image size={20} />
                            {language === 'id' ? 'Visualisasi Desain' : 'Design Visualization'}
                        </h4>
                        <button onClick={handleDownloadImage} className="btn btn-primary btn-sm">
                            <Download size={16} />
                            {language === 'id' ? 'Unduh Gambar' : 'Download Image'}
                        </button>
                    </div>
                    <div style={styles.imageContainer}>
                        <img
                            src={`data:${result.generatedImage.mimeType};base64,${result.generatedImage.data}`}
                            alt="AI Generated Room Design"
                            style={styles.generatedImage}
                        />
                    </div>
                </div>
            )}

            {/* Text Suggestions */}
            {result.suggestions && (
                <div style={styles.resultCard} className="resultCard">
                    <div
                        style={styles.content}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(result.suggestions) }}
                    />
                </div>
            )}
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
    imageSection: {
        marginBottom: 'var(--space-xl)',
    },
    imageTitleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-md)',
        flexWrap: 'wrap',
        gap: 'var(--space-sm)',
    },
    imageTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        margin: 0,
        color: 'var(--color-text)',
    },
    imageContainer: {
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
    },
    generatedImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    resultCard: {
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-md)',
    },
    content: {
        fontSize: 'var(--font-size-base)',
        lineHeight: 1.8,
        color: 'var(--color-text)',
    },
};
