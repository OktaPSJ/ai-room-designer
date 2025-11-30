import React, { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AuthModal = ({ isOpen, onClose, t, language }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!supabase) {
                throw new Error(t.supabaseConfigMissing);
            }

            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert(t.checkEmailVerification);
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={styles.overlay}>
            <div className="modal-content" style={styles.modal}>
                <button onClick={onClose} style={styles.closeBtn}>
                    <X size={24} />
                </button>

                <h2 style={styles.title}>
                    {isLogin ? t.welcomeBack : t.createAccount}
                </h2>
                <p style={styles.subtitle}>
                    {isLogin ? t.signInToContinue : t.signUpToStart}
                </p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <Mail size={20} style={styles.icon} />
                        <input
                            type="email"
                            placeholder={t.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <Lock size={20} style={styles.icon} />
                        <input
                            type="password"
                            placeholder={t.passwordPlaceholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={styles.submitBtn}
                    >
                        {loading ? <Loader2 className="spin" size={20} /> : (isLogin ? t.login : t.login)}
                    </button>
                </form>

                <p style={styles.switchText}>
                    {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={styles.switchBtn}
                    >
                        {isLogin ? t.createAccount : t.login}
                    </button>
                </p>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
        background: 'var(--color-surface)',
        padding: '2.5rem',
        borderRadius: '1.5rem',
        width: '90%',
        maxWidth: '420px',
        position: 'relative',
        border: '1px solid var(--color-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideUp 0.3s ease-out',
    },
    closeBtn: {
        position: 'absolute',
        top: '1.25rem',
        right: '1.25rem',
        background: 'var(--color-bg-secondary)',
        border: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '50%',
        display: 'flex',
        transition: 'all 0.2s',
    },
    title: {
        textAlign: 'center',
        marginBottom: '0.5rem',
        color: 'var(--color-text)',
        fontSize: '1.75rem',
        fontWeight: '800',
        letterSpacing: '-0.025em',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: 'var(--color-text-secondary)',
        fontSize: '0.95rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: '1rem',
        color: 'var(--color-text-muted)',
        pointerEvents: 'none',
    },
    input: {
        width: '100%',
        padding: '0.875rem 1rem 0.875rem 3rem',
        borderRadius: '0.75rem',
        border: '2px solid var(--color-bg-secondary)',
        background: 'var(--color-bg-secondary)',
        color: 'var(--color-text)',
        fontSize: '1rem',
        transition: 'all 0.2s',
        outline: 'none',
    },
    submitBtn: {
        marginTop: '0.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.875rem',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: '0.75rem',
        background: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'transform 0.1s',
    },
    error: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        padding: '1rem',
        borderRadius: '0.75rem',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    switchText: {
        textAlign: 'center',
        marginTop: '2rem',
        color: 'var(--color-text-secondary)',
        fontSize: '0.95rem',
    },
    switchBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-primary)',
        fontWeight: '700',
        cursor: 'pointer',
        marginLeft: '0.25rem',
    },
};

export default AuthModal;
