import React from 'react';
import { Palette } from 'lucide-react';

export default function RoomStyleSelector({
    selectedStyle,
    onStyleSelect,
    customContext,
    onContextChange,
    t
}) {
    const ROOM_STYLES = [
        {
            id: 'modern',
            name: t.modernMinimalist,
            description: t.modernDesc,
            image: '/images/modern.png',
        },
        {
            id: 'scandinavian',
            name: t.scandinavian,
            description: t.scandinavianDesc,
            image: '/images/scandinavian.png',
        },
        {
            id: 'industrial',
            name: t.industrial,
            description: t.industrialDesc,
            image: '/images/industrial.png',
        },
        {
            id: 'bohemian',
            name: t.bohemian,
            description: t.bohemianDesc,
            image: '/images/bohemian.png',
        },
        {
            id: 'luxury',
            name: t.luxury,
            description: t.luxuryDesc,
            image: '/images/luxury.png',
        },
        {
            id: 'coastal',
            name: t.coastal,
            description: t.coastalDesc,
            image: '/images/coastal.png',
        },
        {
            id: 'traditional',
            name: t.traditional,
            description: t.traditionalDesc,
            image: '/images/traditional.png',
        },
        {
            id: 'contemporary',
            name: t.contemporary,
            description: t.contemporaryDesc,
            image: '/images/contemporary.png',
        },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    <Palette size={24} />
                    {t.chooseRoomStyle}
                </h3>
                <p style={styles.subtitle}>
                    {t.chooseStyleSubtitle}
                </p>
            </div>

            <div style={styles.grid}>
                {ROOM_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;

                    return (
                        <div
                            key={style.id}
                            style={{
                                ...styles.styleCard,
                                ...(isSelected ? styles.styleCardSelected : {}),
                            }}
                            onClick={() => onStyleSelect(style.id)}
                        >
                            {style.image && (
                                <div style={styles.imageContainer}>
                                    <img src={style.image} alt={style.name} style={styles.image} />
                                </div>
                            )}

                            <div style={styles.cardContent}>
                                <h4 style={styles.styleName}>
                                    {style.name}
                                </h4>
                                <p style={styles.styleDescription}>{style.description}</p>
                            </div>

                            {isSelected && (
                                <div style={styles.selectedIndicator}>✓</div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={styles.contextSection}>
                <label htmlFor="customContext" className="form-label">
                    {t.additionalContext}
                </label>
                <textarea
                    id="customContext"
                    className="form-textarea"
                    placeholder={t.contextPlaceholder}
                    value={customContext}
                    onChange={(e) => onContextChange(e.target.value)}
                    rows={4}
                    style={styles.textarea}
                />
                <p style={styles.contextHint}>
                    💡 {t.contextHint}
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginBottom: 'var(--space-2xl)',
    },
    header: {
        marginBottom: 'var(--space-xl)',
        textAlign: 'center',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-sm)',
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-sm)',
    },
    subtitle: {
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--font-size-base)',
        margin: 0,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-2xl)',
    },
    styleCard: {
        position: 'relative',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        boxShadow: 'var(--shadow-sm)',
    },
    styleCardSelected: {
        borderColor: 'var(--color-primary)',
        boxShadow: 'var(--shadow-glow)',
        transform: 'translateY(-4px)',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '180px',
        overflow: 'hidden',
        background: 'var(--color-bg-tertiary)',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cardContent: {
        padding: 'var(--space-lg)',
    },
    styleName: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        marginBottom: 'var(--space-sm)',
    },
    styleDescription: {
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--font-size-sm)',
        margin: 0,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 'var(--space-md)',
        right: 'var(--space-md)',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'var(--font-size-lg)',
        boxShadow: 'var(--shadow-glow)',
    },
    contextSection: {
        marginTop: 'var(--space-2xl)',
        padding: 'var(--space-xl)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
    },
    textarea: {
        marginBottom: 'var(--space-sm)',
    },
    contextHint: {
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
        margin: 0,
    },
};
