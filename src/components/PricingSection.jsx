import React from 'react';
import { Check, X, Crown, Zap } from 'lucide-react';

const FEATURES = [
    { name: 'Upload foto ruangan', free: '3/hari', premium: 'Unlimited' },
    { name: 'AI design suggestions', free: true, premium: true },
    { name: 'Basic room styles', free: '3 styles', premium: '15+ styles' },
    { name: 'High-resolution export', free: false, premium: true },
    { name: 'No watermark', free: false, premium: true },
    { name: 'Save & manage projects', free: false, premium: true },
    { name: 'Priority processing', free: false, premium: true },
    { name: 'Ads', free: 'Yes', premium: 'No ads' },
];

export default function PricingSection({ onUpgrade }) {
    return (
        <section style={styles.section}>
            <div className="container">
                <div style={styles.header}>
                    <h2 style={styles.title}>Pilih Plan yang Sesuai</h2>
                    <p style={styles.subtitle}>
                        Mulai gratis atau upgrade untuk akses unlimited dan fitur premium
                    </p>
                </div>

                <div style={styles.grid}>
                    {/* Free Plan */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.planName}>Free</h3>
                            <div style={styles.price}>
                                <span style={styles.priceAmount}>Rp 0</span>
                                <span style={styles.pricePeriod}>/selamanya</span>
                            </div>
                        </div>

                        <ul style={styles.featureList}>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIcon} />
                                <span>3 uploads per hari</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIcon} />
                                <span>3 basic room styles</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIcon} />
                                <span>AI design suggestions</span>
                            </li>
                            <li style={{ ...styles.featureItem, ...styles.featureDisabled }}>
                                <X size={20} style={styles.xIcon} />
                                <span>Watermark pada hasil</span>
                            </li>
                            <li style={{ ...styles.featureItem, ...styles.featureDisabled }}>
                                <X size={20} style={styles.xIcon} />
                                <span>Tampil iklan</span>
                            </li>
                        </ul>

                        <button className="btn btn-secondary" style={styles.ctaButton}>
                            Mulai Gratis
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div style={{ ...styles.card, ...styles.cardPremium }}>
                        <div style={styles.popularBadge}>
                            <Zap size={14} />
                            Most Popular
                        </div>

                        <div style={styles.cardHeader}>
                            <h3 style={styles.planName}>
                                <Crown size={24} style={styles.crownIcon} />
                                Premium
                            </h3>
                            <div style={styles.price}>
                                <span style={styles.priceAmount}>Rp 99.000</span>
                                <span style={styles.pricePeriod}>/bulan</span>
                            </div>
                        </div>

                        <ul style={styles.featureList}>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIconPremium} />
                                <span><strong>Unlimited</strong> uploads</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIconPremium} />
                                <span><strong>15+</strong> room styles</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIconPremium} />
                                <span>No watermark</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIconPremium} />
                                <span>High-resolution export</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIconPremium} />
                                <span>Save & manage projects</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIconPremium} />
                                <span>Priority processing</span>
                            </li>
                            <li style={styles.featureItem}>
                                <Check size={20} style={styles.checkIconPremium} />
                                <span><strong>No ads</strong></span>
                            </li>
                        </ul>

                        <button onClick={onUpgrade} className="btn btn-primary" style={styles.ctaButton}>
                            <Crown size={20} />
                            Upgrade ke Premium
                        </button>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div style={styles.comparisonSection}>
                    <h3 style={styles.comparisonTitle}>Perbandingan Lengkap</h3>
                    <div style={styles.table}>
                        <div style={styles.tableHeader}>
                            <div style={styles.tableCell}>Fitur</div>
                            <div style={styles.tableCell}>Free</div>
                            <div style={styles.tableCell}>Premium</div>
                        </div>
                        {FEATURES.map((feature, index) => (
                            <div key={index} style={styles.tableRow}>
                                <div style={styles.tableCell}>{feature.name}</div>
                                <div style={styles.tableCell}>
                                    {typeof feature.free === 'boolean' ? (
                                        feature.free ? (
                                            <Check size={20} style={styles.checkIcon} />
                                        ) : (
                                            <X size={20} style={styles.xIcon} />
                                        )
                                    ) : (
                                        feature.free
                                    )}
                                </div>
                                <div style={styles.tableCell}>
                                    {typeof feature.premium === 'boolean' ? (
                                        feature.premium ? (
                                            <Check size={20} style={styles.checkIconPremium} />
                                        ) : (
                                            <X size={20} style={styles.xIcon} />
                                        )
                                    ) : (
                                        <strong>{feature.premium}</strong>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const styles = {
    section: {
        padding: 'var(--space-4xl) 0',
        background: 'var(--color-bg-secondary)',
    },
    header: {
        textAlign: 'center',
        marginBottom: 'var(--space-3xl)',
    },
    title: {
        fontSize: 'var(--font-size-4xl)',
        fontWeight: 800,
        marginBottom: 'var(--space-md)',
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    subtitle: {
        fontSize: 'var(--font-size-lg)',
        color: 'var(--color-text-secondary)',
        margin: 0,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-2xl)',
        maxWidth: '900px',
        margin: '0 auto var(--space-4xl)',
    },
    card: {
        position: 'relative',
        background: 'var(--color-bg)',
        border: '2px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-2xl)',
        transition: 'all var(--transition-base)',
    },
    cardPremium: {
        borderColor: 'var(--color-primary)',
        boxShadow: 'var(--shadow-glow)',
        transform: 'scale(1.05)',
    },
    popularBadge: {
        position: 'absolute',
        top: '-12px',
        right: 'var(--space-xl)',
        background: 'var(--gradient-secondary)',
        color: 'white',
        padding: 'var(--space-xs) var(--space-md)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    cardHeader: {
        marginBottom: 'var(--space-xl)',
    },
    planName: {
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
    },
    crownIcon: {
        color: 'var(--color-primary-light)',
    },
    price: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--space-sm)',
    },
    priceAmount: {
        fontSize: 'var(--font-size-4xl)',
        fontWeight: 800,
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    pricePeriod: {
        fontSize: 'var(--font-size-base)',
        color: 'var(--color-text-muted)',
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 var(--space-2xl) 0',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md) 0',
        borderBottom: '1px solid var(--color-border)',
    },
    featureDisabled: {
        opacity: 0.5,
    },
    checkIcon: {
        color: 'var(--color-success)',
        flexShrink: 0,
    },
    checkIconPremium: {
        color: 'var(--color-primary-light)',
        flexShrink: 0,
    },
    xIcon: {
        color: 'var(--color-text-muted)',
        flexShrink: 0,
    },
    ctaButton: {
        width: '100%',
    },
    comparisonSection: {
        marginTop: 'var(--space-4xl)',
    },
    comparisonTitle: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 'var(--space-2xl)',
    },
    table: {
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        background: 'var(--color-surface)',
        fontWeight: 700,
        borderBottom: '2px solid var(--color-border)',
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        borderBottom: '1px solid var(--color-border)',
    },
    tableCell: {
        padding: 'var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
};
