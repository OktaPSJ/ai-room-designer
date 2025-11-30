import React, { useEffect, useRef } from 'react';

export default function AdPlaceholder({ isPremium, position = 'default' }) {
    const adContainerRef = useRef(null);

    useEffect(() => {
        if (isPremium || !adContainerRef.current) return;

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="effectivegatecpm"]');
        if (!existingScript) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//pl28163160.effectivegatecpm.com/8b/e1/f2/8be1f21c30d06cc15bb71fca39e8019e.js';
            script.async = true;
            adContainerRef.current.appendChild(script);
        }
    }, [isPremium]);

    if (isPremium) return null;

    return (
        <div style={styles.container}>
            <div ref={adContainerRef} style={styles.adBox}>
                {/* Ad script will be injected here */}
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
