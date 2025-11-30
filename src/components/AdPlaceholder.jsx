import React from 'react';

export default function AdPlaceholder({ isPremium, position = 'default' }) {
    if (isPremium) return null;

    // Different ad sizes based on position
    const getAdConfig = () => {
        switch (position) {
            case 'top':
                return {
                    height: '90px',
                    label: 'Banner Ad (728x90)',
                    hint: 'Leaderboard Ad',
                };
            case 'middle':
                return {
                    height: '250px',
                    label: 'Rectangle Ad (300x250)',
                    hint: 'Medium Rectangle',
                };
            case 'bottom':
                return {
                    height: '100px',
                    label: 'Banner Ad (728x90)',
                    hint: 'Leaderboard Ad',
                };
            default:
                return {
                    height: '120px',
                    label: 'Ad Space',
                    hint: 'Advertisement',
                };
        }
    };

    const config = getAdConfig();

    return (
        <div style={styles.container}>
            <div style={{ ...styles.adBox, minHeight: config.height }}>
                <p style={styles.adLabel}>Advertisement</p>
                <div style={styles.adContent}>
                    {/*
                      Untuk integrasi Google AdSense, ganti placeholder ini dengan:
                      <ins class="adsbygoogle"
                           style="display:block"
                           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                           data-ad-slot="XXXXXXXXXX"
                           data-ad-format="auto"
                           data-full-width-responsive="true"></ins>
                      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                    */}
                    <p style={styles.adText}>
                        {config.label}
                    </p>
                    <p style={styles.adSubtext}>
                        {config.hint}
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        margin: 'var(--space-xl) 0',
    },
    adBox: {
        background: 'linear-gradient(135deg, var(--color-bg-tertiary) 0%, var(--color-bg-secondary) 100%)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    adLabel: {
        fontSize: '10px',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: 'var(--space-sm)',
        opacity: 0.7,
    },
    adContent: {
        padding: 'var(--space-lg)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-border)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adText: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
        marginBottom: 'var(--space-xs)',
        color: 'var(--color-text-muted)',
    },
    adSubtext: {
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
        margin: 0,
        opacity: 0.7,
    },
};
