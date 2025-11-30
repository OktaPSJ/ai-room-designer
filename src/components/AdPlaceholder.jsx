import React from 'react';

export default function AdPlaceholder({ isPremium, position = 'default' }) {
    if (isPremium) return null;

    // The ad script is loaded in index.html
    // This component just provides a container for the ad network to inject ads
    return (
        <div style={styles.container}>
            <div style={styles.adBox} id={`ad-container-${position}`}>
                {/* Ad will be injected by the ad network script */}
            </div>
        </div>
    );
}

const styles = {
    container: {
        margin: 'var(--space-xl) 0',
    },
    adBox: {
        minHeight: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};
