const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Using Gemini 2.0 Flash for fast and free vision analysis
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
    console.log('=== DEBUG: Gemini analyzeRoom called ===');
    console.log('API_KEY exists:', !!API_KEY);
    console.log('Room Style:', roomStyle);
    console.log('Image file:', imageFile?.name, imageFile?.size, 'bytes');

    if (!API_KEY) {
        throw new Error('Gemini API key not configured. Please check VITE_GEMINI_API_KEY in .env');
    }

    try {
        const base64Image = await fileToBase64(imageFile);
        const mimeType = getMimeType(imageFile);

        console.log('=== DEBUG: Image converted ===');
        console.log('Base64 length:', base64Image.length);
        console.log('MIME type:', mimeType);

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
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
        };

        console.log('=== DEBUG: Sending request to Gemini ===');

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log('=== DEBUG: Response received ===');
        console.log('Response status:', response.status);

        const result = await response.json();
        console.log('=== DEBUG: Full API Response ===');
        console.log(JSON.stringify(result, null, 2));

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to analyze image');
        }

        // Extract text from Gemini response
        const suggestions = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';

        console.log('=== DEBUG: Extracted suggestions ===');
        console.log('Suggestions length:', suggestions.length);

        return {
            success: true,
            suggestions: suggestions,
            style: roomStyle,
        };

    } catch (error) {
        console.error('=== DEBUG: Error ===');
        console.error('Error:', error);
        throw new Error(`AI Analysis Failed: ${error.message}`);
    }
}

export function isApiKeyConfigured() {
    return !!API_KEY;
}
