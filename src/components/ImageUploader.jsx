import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, Image as ImageIcon, Clipboard } from 'lucide-react';
import Webcam from 'react-webcam';

export default function ImageUploader({
    onImageSelect,
    isPremium,
    remainingUploads,
    disabled,
    t
}) {
    const [preview, setPreview] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showPasteHint, setShowPasteHint] = useState(false);
    const fileInputRef = useRef(null);
    const webcamRef = useRef(null);

    // Add paste event listener
    useEffect(() => {
        const handlePaste = (e) => {
            if (disabled) return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        handleFile(blob);
                        setShowPasteHint(false);
                    }
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [disabled, onImageSelect]); // Added onImageSelect to dependencies as handleFile uses it

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (disabled) return;
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onImageSelect(file);
        };
        reader.readAsDataURL(file);
    };

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                    setPreview(imageSrc);
                    onImageSelect(file);
                    setShowCamera(false);
                });
        }
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    <ImageIcon size={24} />
                    {t.uploadRoomPhoto}
                </h3>
                {!isPremium && (
                    <div style={styles.limitBadge}>
                        <span className="badge bg-gradient-accent" style={styles.badge}>
                            {remainingUploads} {t.uploadsRemaining}
                        </span>
                    </div>
                )}
            </div>

            {preview ? (
                <div style={styles.previewContainer}>
                    <img src={preview} alt="Preview" style={styles.previewImage} />
                    <button onClick={clearImage} style={styles.clearButton} className="btn btn-secondary btn-sm">
                        <X size={16} />
                        {t.changePhoto}
                    </button>
                </div>
            ) : showCamera ? (
                <div style={styles.cameraContainer}>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        style={styles.webcam}
                    />
                    <div style={styles.cameraControls}>
                        <button onClick={handleCapture} className="btn btn-primary">
                            <Camera size={20} />
                            {t.takePhoto}
                        </button>
                        <button onClick={() => setShowCamera(false)} className="btn btn-secondary">
                            {t.cancel}
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        ...styles.uploadArea,
                        ...(dragActive ? styles.uploadAreaActive : {}),
                        ...(disabled ? styles.uploadAreaDisabled : {}),
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                >
                    <div style={styles.uploadIconWrapper}>
                        <Upload size={48} style={styles.uploadIcon} />
                    </div>
                    <p style={styles.uploadText}>
                        {t.dragDropText}
                    </p>
                    <p style={styles.uploadHint}>
                        {t.supportedFormats}
                    </p>

                    <div style={styles.orDivider}>
                        <span>{t.or}</span>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!disabled) setShowCamera(true);
                            }}
                            className="btn btn-outline"
                            disabled={disabled}
                        >
                            <Camera size={20} />
                            {t.useCamera}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPasteHint(true);
                                setTimeout(() => setShowPasteHint(false), 3000);
                            }}
                            className="btn btn-outline"
                            disabled={disabled}
                            style={styles.pasteButton}
                        >
                            <Clipboard size={20} />
                            Paste Image
                        </button>
                    </div>

                    {showPasteHint && (
                        <p style={styles.pasteHint}>
                            💡 Press <kbd style={styles.kbd}>Ctrl+V</kbd> (or <kbd style={styles.kbd}>⌘+V</kbd> on Mac) to paste an image from clipboard
                        </p>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        style={styles.fileInput}
                        disabled={disabled}
                    />
                </div>
            )}

            {disabled && (
                <div style={styles.disabledMessage}>
                    <p>⚠️ {t.dailyLimitReached}</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        marginBottom: 'var(--space-2xl)',
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
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        margin: 0,
    },
    limitBadge: {},
    badge: {
        color: 'white',
        fontWeight: 700,
    },
    uploadArea: {
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-3xl)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
    },
    uploadAreaActive: {
        borderColor: 'var(--color-primary)',
        background: 'var(--glass-bg)',
        transform: 'scale(1.02)',
        boxShadow: 'var(--shadow-glow)',
    },
    uploadAreaDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    uploadIconWrapper: {
        width: '80px',
        height: '80px',
        margin: '0 auto var(--space-md)',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-glow)',
    },
    uploadIcon: {
        color: 'white',
    },
    uploadText: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 500,
        marginBottom: 'var(--space-sm)',
        color: 'var(--color-text)',
    },
    uploadHint: {
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
        marginBottom: 'var(--space-xl)',
    },
    orDivider: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-md)',
        margin: 'var(--space-xl) 0',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-sm)',
    },
    buttonGroup: {
        display: 'flex',
        gap: 'var(--space-md)',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    pasteButton: {
        background: 'var(--gradient-accent)',
        color: 'white',
        border: 'none',
    },
    pasteHint: {
        marginTop: 'var(--space-md)',
        padding: 'var(--space-md)',
        background: 'var(--color-info)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out',
    },
    kbd: {
        display: 'inline-block',
        padding: '2px 6px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        margin: '0 2px',
    },
    fileInput: {
        display: 'none',
    },
    previewContainer: {
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
    },
    previewImage: {
        width: '100%',
        height: 'auto',
        maxHeight: '500px',
        objectFit: 'contain',
        background: 'var(--color-bg-tertiary)',
    },
    clearButton: {
        position: 'absolute',
        top: 'var(--space-md)',
        right: 'var(--space-md)',
    },
    cameraContainer: {
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
    },
    webcam: {
        width: '100%',
        height: 'auto',
    },
    cameraControls: {
        display: 'flex',
        gap: 'var(--space-md)',
        padding: 'var(--space-lg)',
        background: 'var(--color-surface)',
        justifyContent: 'center',
    },
    disabledMessage: {
        marginTop: 'var(--space-md)',
        padding: 'var(--space-md)',
        background: 'var(--gradient-accent)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        fontWeight: 500,
    },
};
