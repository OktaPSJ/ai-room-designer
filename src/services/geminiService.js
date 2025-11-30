const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Primary model for text analysis (more stable, higher quota)
const TEXT_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Experimental model for image generation (lower quota)
const IMAGE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

/**
 * Convert image file to base64
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Get MIME type from file
 */
function getMimeType(file) {
    return file.type || 'image/jpeg';
}

/**
 * Try to generate image with experimental model
 */
async function tryGenerateImage(base64Image, mimeType, roomStyle, customContext) {
    const prompt = `You are a professional interior designer. Look at this room photo and create a visualization of how the room would look redesigned in ${roomStyle} style.

${customContext ? `User request: ${customContext}\n` : ''}

IMPORTANT: Generate an image showing the redesigned room with ${roomStyle} style furniture, colors, and decorations. Show what the room would look like after the makeover.`;

    const requestBody = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image
                    }
                }
            ]
        }],
        generationConfig: {
            responseModalities: ["IMAGE"],
            temperature: 0.7,
        }
    };

    const response = await fetch(`${IMAGE_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        return null; // Image generation failed, will use text only
    }

    const result = await response.json();
    const parts = result.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
        if (part.inlineData) {
            return {
                data: part.inlineData.data,
                mimeType: part.inlineData.mimeType || 'image/png'
            };
        }
    }
    return null;
}

/**
 * Generate text suggestions (more reliable)
 */
async function generateTextSuggestions(base64Image, mimeType, roomStyle, customContext) {
    const prompt = `Kamu adalah seorang desainer interior profesional. Analisis foto ruangan ini dan berikan saran desain interior dengan gaya ${roomStyle}.
${customContext ? `Permintaan khusus pengguna: ${customContext}\n` : ''}

Berikan rekomendasi detail dalam format berikut:

**Penilaian Keseluruhan:**
[Deskripsi singkat kondisi ruangan saat ini]

**Palet Warna:**
- Warna utama: [sebutkan warna dengan kode hex]
- Warna aksen: [sebutkan warna dengan kode hex]

**Rekomendasi Furnitur:**
1. [Item] - [Penempatan dan alasan]
2. [Item] - [Penempatan dan alasan]
3. [Item] - [Penempatan dan alasan]

**Dekorasi & Pencahayaan:**
- [Saran dekorasi]
- [Saran pencahayaan]

**Tips Hemat Budget:**
- [Tips 1]
- [Tips 2]

Berikan saran yang praktis dan spesifik untuk gaya ${roomStyle}. Jawab dalam Bahasa Indonesia.`;

    const requestBody = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image
                    }
                }
            ]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
        }
    };

    const response = await fetch(`${TEXT_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Terlalu banyak permintaan. Silakan tunggu 1 menit dan coba lagi.');
        }
        throw new Error(result.error?.message || 'Failed to analyze image');
    }

    return result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
}

export async function analyzeRoom(imageFile, roomStyle, customContext = '') {
    if (!API_KEY) {
        throw new Error('Gemini API key not configured. Please check VITE_GEMINI_API_KEY in .env');
    }

    try {
        const base64Image = await fileToBase64(imageFile);
        const mimeType = getMimeType(imageFile);

        // Try both in parallel - text is priority, image is bonus
        const [suggestions, generatedImage] = await Promise.all([
            generateTextSuggestions(base64Image, mimeType, roomStyle, customContext),
            tryGenerateImage(base64Image, mimeType, roomStyle, customContext).catch(() => null)
        ]);

        return {
            success: true,
            suggestions: suggestions,
            generatedImage: generatedImage,
            style: roomStyle,
        };

    } catch (error) {
        console.error('Analysis error:', error);
        throw new Error(`AI Analysis Failed: ${error.message}`);
    }
}

export function isApiKeyConfigured() {
    return !!API_KEY;
}
