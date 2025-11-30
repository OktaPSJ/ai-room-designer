const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Using Gemini 2.0 Flash Experimental for image generation
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

/**
 * Convert image file to base64
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Remove data:image/jpeg;base64, prefix
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

export async function analyzeRoom(imageFile, roomStyle, customContext = '') {
    if (!API_KEY) {
        throw new Error('Gemini API key not configured. Please check VITE_GEMINI_API_KEY in .env');
    }

    try {
        const base64Image = await fileToBase64(imageFile);
        const mimeType = getMimeType(imageFile);

        const prompt = `Kamu adalah seorang desainer interior profesional. Lihat foto ruangan ini dan buatkan visualisasi desain ulang ruangan dengan gaya ${roomStyle}.

${customContext ? `Permintaan khusus: ${customContext}\n` : ''}

PENTING: Generate gambar visualisasi ruangan yang sudah di-redesign dengan gaya ${roomStyle}. Tunjukkan bagaimana ruangan akan terlihat setelah di-desain ulang dengan furnitur, warna, dan dekorasi yang sesuai dengan gaya ${roomStyle}.

Setelah gambar, berikan penjelasan singkat dalam Bahasa Indonesia tentang:
1. Palet warna yang digunakan
2. Furnitur utama yang ditambahkan
3. Tips dekorasi`;

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
                responseModalities: ["TEXT", "IMAGE"],
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        };

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (!response.ok) {
            // Handle rate limit error
            if (response.status === 429) {
                throw new Error('Terlalu banyak permintaan. Silakan tunggu 1 menit dan coba lagi.');
            }
            throw new Error(result.error?.message || 'Failed to analyze image');
        }

        // Extract text and image from Gemini response
        let suggestions = '';
        let generatedImage = null;

        const parts = result.candidates?.[0]?.content?.parts || [];

        for (const part of parts) {
            if (part.text) {
                suggestions += part.text;
            }
            if (part.inlineData) {
                generatedImage = {
                    data: part.inlineData.data,
                    mimeType: part.inlineData.mimeType || 'image/png'
                };
            }
        }

        if (!suggestions && !generatedImage) {
            suggestions = 'No response from AI';
        }

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
