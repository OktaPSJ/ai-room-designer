const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Convert image file to base64
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Compress image only if larger than maxSize (2MB default)
 */
async function compressIfNeeded(file, maxSizeMB = 2) {
    const maxSize = maxSizeMB * 1024 * 1024;

    // If file is under max size, return original as base64
    if (file.size <= maxSize) {
        return await fileToBase64(file);
    }

    // Compress the image
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions (max 1500px)
            let width = img.width;
            let height = img.height;
            const maxWidth = 1500;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Try different quality levels until under 2MB
            let quality = 0.9;
            const tryCompress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (blob.size > maxSize && quality > 0.5) {
                            quality -= 0.1;
                            tryCompress();
                        } else {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            tryCompress();
        };

        img.src = URL.createObjectURL(file);
    });
}

export async function analyzeRoom(imageFile, roomStyle, customContext = '') {
    if (!API_KEY) {
        throw new Error('OpenAI API key not configured. Please check VITE_OPENAI_API_KEY in .env');
    }

    try {
        // Compress only if > 2MB
        const base64Image = await compressIfNeeded(imageFile, 2);

        const prompt = `Kamu adalah desainer interior profesional. Analisis foto ruangan ini dan berikan saran desain dengan gaya ${roomStyle}.
${customContext ? `Permintaan khusus: ${customContext}\n` : ''}

Berikan rekomendasi dalam format berikut (dalam Bahasa Indonesia):

**Penilaian Keseluruhan:**
[Deskripsi singkat kondisi ruangan saat ini]

**Palet Warna:**
- Warna utama: [warna dengan kode hex]
- Warna aksen: [warna dengan kode hex]

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

Berikan saran yang praktis dan spesifik untuk gaya ${roomStyle}.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: base64Image,
                                    detail: 'high'
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1500,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to analyze image');
        }

        const suggestions = result.choices?.[0]?.message?.content || 'No response from AI';

        return {
            success: true,
            suggestions: suggestions,
            generatedImage: null, // OpenAI vision doesn't generate images
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
